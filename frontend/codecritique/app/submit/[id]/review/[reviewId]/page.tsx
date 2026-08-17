"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Review } from "@/app/types";

export default function ReviewDetails() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const params = useParams()
    const router = useRouter();
    const submissionId = params.id as string;
    const reviewId = params.reviewId as string;

    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded)
            return;

        const loadReview = async () => {
            if (!isSignedIn) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");

                const token = await getToken();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || `Failed to load review`
                    )
                }
                setReview(data.data || data);
            } catch (err) {
                console.log(err);
                setError(
                    err instanceof Error ? err.message : `Something went wrong`
                )
            }
            finally {
                setLoading(false);
            }
        }
        loadReview();

    }, [isLoaded, isSignedIn, reviewId, getToken]);

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-700">Loading Review...</p>
            </div>
        )
    }
    if (!isSignedIn) {
        return (
            <div className="mx-auto mt-15 max-w-2xl px-5 text-center">
                <p className="text-sm text-red-700">Please sign in to view this review.</p>

                <Button className="mt-5" onClick={() => router.push("./")}>Back to home</Button>
            </div>
        )
    }
    if (!review) {
        return (
            <div className="mx-auto mt-15 max-w-2xl px-5 text-center">
                <p className="text-sm text-red-700">
                    {error || "Review not found"}
                </p>

                <Button className="mt-5" onClick={() =>
                    router.push(`/submit/${submissionId}`)}> Back to submission</Button>
            </div>
        );
    }
    const reviewerName = review.reviewer?.userName ||
        `${review.reviewer?.firstName || " "} ${review.reviewer?.lastName || " "} ${review.reviewer?.userName || " "}`.trim() || "Anonymous";

    const totalScore = review.ratings?.reduce((total, rating) => total + rating.score, 0) || 0;

    const ratingCount = review.ratings?.length || 0;

    const averageScore = ratingCount > 0 ? (totalScore / ratingCount).toFixed(1) : null;

    return (
        <div className="min-h-screen bg-muted/40 px-5 py-10">
            <div className="mx-auto max-w-2xl">
                <Button type="button" variant="ghost" size="sm" className="mb-5 px-0 text-gray-700 hover:bg-transparent hover:text-gray-500" onClick={() =>
                    router.push(`/submit/${submissionId}`)
                }>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Submissions
                </Button>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Review Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {review.reviewer?.profileImageUrl ? (
                                    <img src={review.reviewer.profileImageUrl} alt={reviewerName} className="h-14 w-14 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                                        {reviewerName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-lg font-semibold"> {reviewerName}</p>
                                    {review.reviewer?.karmaPoints !==
                                        undefined && (
                                            <p className="text-sm text-gray-600">
                                                {review.reviewer.karmaPoints}{" "} Karma Points </p>
                                        )}
                                </div>
                            </div>
                        </div>
                        {averageScore && (
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-semibold self-center">
                                {averageScore}/10
                            </Badge>
                        )}
                    </CardContent>

                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold"> Strengths </h3>
                            <p className="whitespace-pre-line text-sm text-zinc-700">
                                {review.strengths || "No strengths provided."} </p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-sm font-semibold"> Areas for Improvement</h3>
                            <p className="whitespace-pre-line text-sm text-zinc-700">
                                {review.improvements || "No improvements provided."}</p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-sm font-semibold"> Helpful Resources </h3>
                            <p className="whitespace-pre-line text-sm text-zinc-700">
                                {review.resources || "No resources provided."}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Review Criteria</CardTitle>
                        <p className="text-sm text-gray-700">Scores given by the reviewer</p>
                    </CardHeader>
                    <CardContent>{review.ratings && review.ratings.length > 0 ? (
                        <div className="space-y-3">
                            {review.ratings.map((rating) => (
                                <div key={rating.id} className="flex items-center justify-between rounded-lg border p-4" >
                                    <p className="text-sm font-medium">{rating.criteria?.name || "Criterion"}</p>
                                    <Badge variant="secondary">{rating.score}/10</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-600">No ratings available. </p>
                    )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )









}

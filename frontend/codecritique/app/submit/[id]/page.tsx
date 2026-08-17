"use client"

import { SetStateAction, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import type { Submission, Tag, ReviewCriteria, ReviewRating, Review } from "@/app/types"

export default function SubmissionByIdPage() {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const params = useParams();
    const router = useRouter();

    const submissionId = params.id as string;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [criteria, setCriteria] = useState<ReviewCriteria[]>([]);
    const [Reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        if (!isLoaded) {
            return;
        }
        const loadSubmission = async () => {
            try {
                setLoading(true);
                setError("");

                const submissionRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
                )
                const submissionData = await submissionRes.json();
                if (!submissionRes.ok) {
                    throw new Error(
                        submissionData.message ||
                        "Failed to load submission"
                    );
                }

                setSubmission(
                    submissionData.data || submissionData
                );

                const crireriaRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/criterias/submission/${submissionId}`,
                )
                const criteriaData = await crireriaRes.json();
                if (!crireriaRes.ok) {
                    throw new Error(
                        criteriaData.message ||
                        "Failed to load submission"
                    );
                }

                setCriteria(
                    criteriaData.data || criteriaData
                );

                if (isSignedIn) {
                    const token = await getToken();

                    const reviewRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/reviews/submission/${submissionId}`,
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }
                    );

                    const reviewData = await reviewRes.json();
                    if (!reviewRes.ok) {
                        throw new Error(
                            reviewData.message ||
                            "Failed to load submission"
                        );
                    }

                    setReviews(
                        reviewData.data || reviewData
                    );
                } else {
                    setReviews([])
                }
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        }

        loadSubmission();

    }, [isLoaded, isSignedIn, submissionId, getToken]);

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h items-center justify-center">
                <p className="text-sm text-gray-700">Loading Submissions...</p>
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="mx-auto mt-15 max-w-2xl px-5 text-center">
                <p className="text-sm text-red-700">{error || "Submission not found"} </p>
                <Button className="mt-5" onClick={() => router.push("/")}> Back to home</Button>
            </div>
        );
    }
    const userName = submission?.user?.userName ||
        `${submission?.user?.firstName || ""}
     ${submission?.user?.lastName || ""}`.trim() || "Anonymous";

    return (
        <div className="min-h-screen bg-muted/40 px-5 py-10">
            <div className="mx-auto max-w-2xl">
                <Button type="button" variant="ghost" size="sm" className="mb-5 px-0 text-gray-700 hover:bg-transparent hover:text-gray-500" onClick={() => router.push("/")}
                >
                    <ArrowLeft className="h-4 w-4"></ArrowLeft>Back to submissions
                </Button>

                <Card className="mb-5">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                                <CardTitle className="text-3xl font-bold">{submission?.title}</CardTitle>
                                <p className="mt-2 text-sm text-zinc-700">Submitted By {" "}<span className="font-medium text-zinc-800">{userName}</span></p>
                            </div>
                            <Badge
                                variant={submission?.status === "REVIEWED" ? "default" : "secondary"}
                                className={submission?.status === "REVIEWED" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-green-100 text-green-800 hover:bg-green-100:"}>
                                {submission.status === "REVIEWED" ? "Reviewed" : "Pending"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-7">
                            <h3 className="mb-2 text-sm font-semibold">Description</h3>
                            <p className="whitespace-pre-line text-sm text-zinc-700">{submission.description}</p>
                        </div>

                        <div className="mb-7">
                            <h3 className="mb-2 text-sm font-semibold">GitHub Repository</h3>
                            <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-blue-600 hover:underline">{submission.githubUrl}</a>
                        </div>

                        {submission.tags && submission.tags.length > 0 && (
                            <div className="mb-7">
                                <h3 className="mb-3 text-sm font-semibold"> Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {submission.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-xs font-medium">{tag.name}</Badge>)
                                    )}
                                </div>
                            </div>
                        )}
                        {submission.user && (
                            <div className="border-t pt-6">
                                <h3 className="mb-3 text-sm font-semibold"> Developer</h3>
                                <div className="flex items-center gap-4">
                                    {submission.user.profileImageUrl ? (
                                        <img src={submission.user.profileImageUrl} alt={userName} className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium"> {userName}</p>
                                        {submission.user.karmaPoints !== undefined && (
                                            <p className="text-xs text-gray-600">{submission.user.karmaPoints} Karma Points</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Review Criteria</CardTitle>
                        <p className="text-sm text-zinc-700">
                            These are the criteria reviewers should use when evaluating this project.</p>
                    </CardHeader>
                    <CardContent>
                        {criteria.length === 0 ? (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                No review criteria have been added for this submission.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {criteria.map((criterion, index) => (
                                    <div key={criterion.id} className="flex items-center gap-3 rounded-lg border bg-background p-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full  text-sm font-semibold">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm font-medium">{criterion.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                </Card>
                {isSignedIn && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl">Reviews</CardTitle>
                            <p className="text-sm text-gray-700">See feedback from other developers who reviewed  this project.</p>
                        </CardHeader>
                        <CardContent>
                            {Reviews.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-center">
                                    <p className="text-sm text-zinc-700">No reviews yet. </p>
                                    <p className="mt-1 text-xs text-gray-700">
                                        Be the first person to review this project.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Reviews.map((review) => {
                                        const reviewerName =
                                            review.reviewer?.userName ||
                                            `${review.reviewer?.firstName || ""} ${review.reviewer?.lastName || ""
                                                }`.trim() ||
                                            "Anonymous";

                                        const totalScore = review.ratings?.reduce(
                                            (total, rating) =>
                                                total + rating.score, 0
                                        ) || 0;

                                        const ratingCount = review.ratings?.length || 0;
                                        const averageScore = ratingCount > 0 ? (totalScore / ratingCount).toFixed(1) : null;
                                        return (
                                            <div
                                                key={review.id}
                                                className="rounded-xl border p-5 transition hover:bg-muted/40">
                                                <div className="flex items-center justify-between gap-4">
                                                    <button
                                                        type="button" onClick={() =>
                                                            router.push(`/submit/${submissionId}/review/${review.id}`)
                                                        } className="flex items-center gap-3 text-left">
                                                        {review.reviewer?.profileImageUrl ? (
                                                            <img src={review.reviewer.profileImageUrl} alt={reviewerName} className="h-11 w-11 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                                                {reviewerName.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold hover:underline">{reviewerName} </p>
                                                            {review.reviewer?.karmaPoints !== undefined &&
                                                                (<p className="text-xs text-gray-700">{review.reviewer.karmaPoints}{" "}Karma Points</p>
                                                                )}
                                                        </div>
                                                    </button>

                                                    {averageScore && (
                                                        <Badge variant="secondary" className="px-3 py-1" >
                                                            {averageScore}/10
                                                        </Badge>
                                                    )}
                                                </div>

                                                {review.strengths && (
                                                    <p className="mt-4 line-clamp-2 text-sm text-zinc-700"> {review.strengths}</p>
                                                )}

                                                <Button type="button" variant="outline" size="sm" className="mt-4"
                                                    onClick={() => router.push(`/submit/${submissionId}/review/${review.id}`)}>
                                                    View Review
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {isSignedIn && (

                    <Card>
                        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Want to review this project?
                                </h3>
                                <p className="text-sm text-zinc-700">
                                    Give feedback and rate this project.
                                </p>
                            </div>

                            <Button
                                size="lg" onClick={() =>
                                    router.push(`/submit/${submissionId}/review`)}>
                                Write a Review
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}




"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import type { Submission,ReviewCriteria} from "@/app/types";

export default function ReviewPage() {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const params = useParams();
    const router = useRouter();

    const submissionId = params.id as string;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [criteria, setCriteria] = useState<ReviewCriteria[]>([]);
    const [strengths, setStrengths] = useState("");
    const [improvements, setImprovements] = useState("");
    const [resources, setResources] = useState("");
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await getToken();
                const submissionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
                    {
                        headers: { Authorization: "Bearer " + token, },
                    }
                );

                const submissionData = await submissionRes.json();
                if (!submissionRes.ok) {
                    throw new Error(
                        submissionData.message ||
                        "Failed to load submission"
                    );
                }

                setSubmission(submissionData.data || submissionData);

                // Load review criteria
                const criteriaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/criterias/submission/${submissionId}`,
                    {
                        headers: { Authorization: "Bearer " + token, },
                    }
                );

                const criteriaData = await criteriaRes.json();

                if (!criteriaRes.ok) {
                    throw new Error(
                        criteriaData.message ||
                        "Failed to load review criteria"
                    );
                }

                const criteriaList = criteriaData.data || criteriaData;

                setCriteria(criteriaList);

                const initialRatings: Record<number, number> = {};

                criteriaList.forEach((criterion: ReviewCriteria) => { initialRatings[criterion.id] = 0; });

                setRatings(initialRatings);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && isSignedIn) {
            loadData();
        }
    },
        [isLoaded, isSignedIn, submissionId, getToken,]);


    const selectRating = (criteriaId: number, score: number) => {
        setRatings((previous) => ({
            ...previous, [criteriaId]: score,
        }));
    };
    //submit review
    const handleSubmit = async () => {
        setSaving(true);
        setSaved(false);
        setError("");

        try {
            const token = await getToken();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${submissionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    submissionId: Number(submissionId),
                    strengths,
                    improvements,
                    resources,
                    ratings: Object.entries(ratings).map(([criteriaId, score]) => ({
                        criteriaId: Number(criteriaId),
                        score,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit review");
            }

            setSaved(true);
            setTimeout(() => router.push(`/submit/${submissionId}`), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-5">
                <p className="text-sm text-muted-foreground">Please sign in to review this submission.</p>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="mx-auto mt-16 max-w-2xl px-5 text-center">
                <p className="text-sm text-red-600">{error || "Submission not found"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-muted/40 px-5 py-10">
            <div className="mx-auto max-w-3xl">

                <Button type="button" variant="ghost" size="sm" className="mb-5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                    onClick={() => router.push(`/submit/${submissionId}`)}
                >
                    Back to submission
                </Button>

                <Card className="mb-5">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                                <h1 className="mb-2 text-2xl font-bold tracking-tight"> {submission.title}</h1>
                                {submission.user && (<p className="text-sm text-muted-foreground">Submitted by{" "}
                                    <strong className="text-foreground">
                                        {submission.user.userName || `${submission.user.firstName || ""} ${submission.user.lastName || ""}`.trim()}
                                    </strong>
                                </p>
                                )}
                            </div>

                            <Badge
                                variant={submission.status === "REVIEWED" ? "default" : "secondary"}
                                className={submission.status === "REVIEWED"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                }>
                                {submission.status}
                            </Badge>
                        </div>

                        <div className="mt-6">
                            <h3 className="mb-2 text-sm font-semibold">
                                Description
                            </h3>
                            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                                {submission.description}
                            </p>
                        </div>

                        <div className="mt-5">
                            <h3 className="mb-2 text-sm font-semibold">GitHub Repository</h3>
                            <a
                                href={submission.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-sm text-blue-600 hover:underline"
                            >
                                {submission.githubUrl}
                            </a>
                        </div>

                        {submission.tags && submission.tags.length > 0 && (
                            <div className="mt-5">
                                <h3 className="mb-3 text-sm font-semibold">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {submission.tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className="px-3 py-1 text-xs font-medium"
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Write a Review</CardTitle>
                        <p className="text-sm text-muted-foreground">Give feedback to help the developer improve their project.</p>
                    </CardHeader>
                    <CardContent>

                        <div className="mb-6 space-y-2">
                            <Label htmlFor="strengths"> Strengths </Label>
                            <Textarea
                                id="strengths"
                                value={strengths}
                                onChange={(e) => setStrengths(e.target.value)}
                                placeholder="What did the developer do well?"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="mb-6 space-y-2">
                            <Label htmlFor="improvements">
                                Areas for Improvement
                            </Label>

                            <Textarea
                                id="improvements"
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                placeholder="What could be improved?"
                                rows={5}
                                required
                            />
                        </div>

                        <div className="mb-7 space-y-2">
                            <Label htmlFor="resources">Helpful Resources
                            </Label>

                            <Textarea
                                id="resources"
                                value={resources}
                                onChange={(e) =>
                                    setResources(e.target.value)
                                }
                                placeholder="Share useful documentation, tutorials, or links..."
                                rows={3}
                            />
                        </div>
                        <div className="border-t pt-7">
                            <h3 className="mb-1.5 text-lg font-bold">
                                Review Criteria
                            </h3>

                            <p className="mb-6 text-xs text-muted-foreground">
                                Rate each criterion from 1 to 10.
                            </p>

                            {criteria.length === 0 ? (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                    No review criteria have been added for this submission yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {criteria.map((criterion) => (
                                        <Card
                                            key={criterion.id}
                                            className="shadow-none"
                                        >
                                            <CardContent className="p-4">
                                                <p className="mb-1 text-sm font-semibold">
                                                    {criterion.name}
                                                </p>

                                                <p className="mb-3 text-xs text-muted-foreground"> Select a score</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => {
                                                        const selected =
                                                            ratings[criterion.id] === score;

                                                        return (
                                                            <Button
                                                                key={score}
                                                                type="button"
                                                                variant={
                                                                    selected
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                size="icon"
                                                                className="h-9 w-9 text-xs"
                                                                onClick={() =>
                                                                    selectRating(
                                                                        criterion.id,
                                                                        score
                                                                    )
                                                                }
                                                            >
                                                                {score}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>


                                                {ratings[criterion.id] > 0 && (
                                                    <p className="mt-3 text-xs text-muted-foreground">
                                                        Selected:{" "}
                                                        <strong className="text-foreground">
                                                            {
                                                                ratings[criterion.id]
                                                            }
                                                            /10
                                                        </strong>
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {saved && (
                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                                Review submitted successfully!
                            </div>
                        )}

                        <div className="mt-7 flex justify-end gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(`/submit/${submissionId}`)
                                }
                                disabled={saving}>Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={
                                    saving || criteria.length === 0
                                }
                            >
                                {saving ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
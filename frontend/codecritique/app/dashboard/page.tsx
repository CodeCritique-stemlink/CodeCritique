"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy, PenLine, MessageCircle, Inbox, Search, MessageSquare, Trash2, Pencil } from "lucide-react";

type Tag = { id: number; name: string };

type Submission = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  tags?: Tag[];
};

type Review = {
  id: number;
  strengths: string;
  improvements: string;
  createdAt: string;
  submission?: {
    id: number;
    title: string;
  };
};

function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>
        {ctaLabel && ctaHref && (
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [karma, setKarma] = useState(0);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<Review[]>([]);
  const [reviewsReceived, setReviewsReceived] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const router =useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = await getToken();

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const profileData = await profileRes.json();
        const userId = profileData.user.id;
        setKarma(profileData.user.karmaPoints || 0);

        const subsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions?userId=${userId}`
        );
        const subsData = await subsRes.json();
        setMySubmissions(subsData.data || []);

        const givenRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/reviewer/${userId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const givenData = await givenRes.json();
        setReviewsGiven(givenData.data || []);

        const allReceived: Review[] = [];
        for (const sub of subsData.data || []) {
          const receivedRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reviews/submission/${sub.id}`
          );
          const receivedData = await receivedRes.json();
          const reviewsForThisSub = (receivedData.data || []).map(
            (r: Review) => ({ ...r, submission: { id: sub.id, title: sub.title } })
          );
          allReceived.push(...reviewsForThisSub);
        }
        setReviewsReceived(allReceived);

        setLoading(false);
      } catch (err) {
        setErrorMsg("Could not load dashboard");
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadDashboard();
    }
  }, [isLoaded, isSignedIn]);

  const handleDeleteSubmission = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this review request")
    if (!confirmed) return;

    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token }
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to delete submission`)
      }
      setMySubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      );

    } catch (error) {
      console.error(error);
      setErrorMsg("Could not delete review request");
    }
  };

  const handleDeleteReview = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this review")
    if (!confirmed) return;

    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token }
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to delete review`)
      }
      setReviewsGiven((prev) =>
        prev.filter((review) => review.id !== id)
      );

    } catch (error) {
      console.error(error);
      setErrorMsg("Could not delete review");
    }
  };
  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-10 lg:px-14">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Activity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your posted requests and review activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trophy size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-foreground">
                {karma}
              </p>
              <p className="text-xs text-muted-foreground">Karma</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground">
              <PenLine size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-foreground">
                {reviewsGiven.length}
              </p>
              <p className="text-xs text-muted-foreground">Reviews Given</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
            >
              <MessageCircle size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-foreground">
                {reviewsReceived.length}
              </p>
              <p className="text-xs text-muted-foreground">Reviews Received</p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground">
          My Requests ({mySubmissions.length})
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Requests you&apos;ve posted for review.
        </p>

        {mySubmissions.length === 0 ? (
          <EmptyState
            icon={<Inbox size={22} strokeWidth={2} />}
            title="You haven't posted any review requests yet."
            subtitle="Share your project and get helpful feedback from other developers."
            ctaLabel="Post your first request"
            ctaHref="/submit"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {mySubmissions.map((sub) => (
              <Card key={sub.id} className="relative shadow-none">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="absolute top-3 right-3 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/submit/${sub.id}/edit`)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSubmission(sub.id)}>
                      <Trash2 size={16} />
                    </Button>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {sub.title}
                      </p>
                      {sub.tags && sub.tags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {sub.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-[10px]">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                      style={{
                        backgroundColor:
                          sub.status === "REVIEWED"
                            ? "var(--reviewed)"
                            : "var(--pending)",
                      }}
                    >
                      {sub.status}
                    </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground">
          Reviews I&apos;ve Given ({reviewsGiven.length})
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Projects you&apos;ve reviewed and provided feedback for.
        </p>

        {reviewsGiven.length === 0 ? (
          <EmptyState
            icon={<Search size={22} strokeWidth={2} />}
            title="You haven't reviewed anyone yet."
            subtitle="Browse the feed and help a fellow developer improve their project."
            ctaLabel="Browse requests"
            ctaHref="/"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {reviewsGiven.map((review) => (
              <Card key={review.id} className="relative shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-foreground">
                      {review.submission?.title || "Submission"}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-secondary text-secondary-foreground"
                      >
                        Review Submitted
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {review.strengths}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/70">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Reviews I&apos;ve Received ({reviewsReceived.length})
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Feedback from other developers on your submissions.
        </p>

        {reviewsReceived.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={22} strokeWidth={2} />}
            title="No one has reviewed your submissions yet."
            subtitle="Once your requests receive reviews, they'll appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {reviewsReceived.map((review) => (
              <Card key={review.id} className="shadow-none">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-foreground">
                    On: {review.submission?.title}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Strengths:
                    </span>{" "}
                    {review.strengths}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Improvements:
                    </span>{" "}
                    {review.improvements}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const TAG_COLORS: Record<string, string> = {
  javascript: "#F7DF1E",
  typescript: "#2563EB",
  python: "#2B6CB0",
  react: "#23484f",
  "next.js": "#18181B",
  "node.js": "#2F8B3F",
  java: "#b7ce0a",
  "c++": "#6c0b74",
  go: "#00A8C6",
  sql: "#D97706",
};

function getTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#000000" : "#FFFFFF";
}

type Submission = {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    userName: string;
    karmaPoints: number;
  };
  tags: { id: number; name: string }[];
};

export default function Home() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [personalized, setPersonalized] = useState(false);
  const [searchTerm, setSearchTearm] = useState("")

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions`
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Could not load submissions");
          setLoading(false);
          return;
        }

        const allSubmissions: Submission[] = data.data;

        // logged-out visitors just see most-recent-first, unchanged
        if (!isSignedIn) {
          setSubmissions(allSubmissions);
          setLoading(false);
          return;
        }

        // logged-in: fetch their tech stack and reorder
        const token = await getToken();
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const profileData = await profileRes.json();
        const myTagIds: number[] = (profileData.user.interestedTags || []).map(
          (t: { id: number }) => t.id
        );

        if (myTagIds.length === 0) {
          // no tech stack picked yet, nothing to personalize against
          setSubmissions(allSubmissions);
          setLoading(false);
          return;
        }

        const now = Date.now();

        const scored = allSubmissions.map((s) => {
          const matchingTags = s.tags.filter((t) =>
            myTagIds.includes(t.id)
          ).length;

          const ageInDays =
            (now - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24);

          // recency bonus: newer posts get a small boost, decaying over 14 days
          const recencyBonus = Math.max(0, 14 - ageInDays) / 14;

          const score = matchingTags * 10 + recencyBonus;

          return { ...s, _score: score };
        });

        scored.sort((a, b) => b._score - a._score);

        setSubmissions(scored);
        setPersonalized(true);
        setLoading(false);
      } catch (err) {
        setErrorMsg("Could not connect to server");
        setLoading(false);
      }
    };

    if (isLoaded) {
      loadSubmissions();
    }
  }, [isLoaded, isSignedIn]);

  const filteredSubmissions = submissions.filter((submission) => {
    const search = searchTerm.toLowerCase();

    return (
      submission.title.toLowerCase().includes(search) ||
      submission.description.toLowerCase().includes(search) ||
      submission.user.userName?.toLowerCase().includes(search) ||
      submission.tags.some((tag) =>
        tag.name.toLowerCase().includes(search)
      )
    );
  });

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="flex-1 w-full px-4 py-6 max-w-7xl mx-auto sm:px-6">
        <div className="col-span-5 bg-zinc-50 dark:bg-black p-6">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Review Requests
            </h1>
            {personalized && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Personalized for you
              </span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search review requests..."
              value={searchTerm}
              onChange={(e) => setSearchTearm(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>


          {loading && (
            <p className="text-zinc-500 text-sm">Loading submissions...</p>
          )}

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          {!loading && !errorMsg && filteredSubmissions.length === 0 && (
            <p className="text-zinc-500 text-sm">
              {searchTerm ? "No review requests match your search."
                : "No review requests yet. Be the first to post one."
              }

            </p>
          )}

          <div className="flex flex-col gap-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {submission.title}
                  </h2>
                  <span className="text-xs text-zinc-400">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                  {submission.description}
                </p>

                {submission.tags && submission.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {submission.tags.map((tag) => {
                      const color = TAG_COLORS[tag.name] || "#6B7280";
                      const textColor = getTextColor(color);
                      return (
                        <span
                          key={tag.id}
                          style={{ backgroundColor: color, color: textColor }}
                          className="inline-flex items-center justify-center text-[10px] font-semibold leading-none px-2.5 py-1.5 rounded-full"
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-3 sm:flex-row sm:items-center">
                  <span className="text-xs text-zinc-500">
                    by{" "}
                    {submission.user.userName ||
                      submission.user.firstName ||
                      "anonymous"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {submission.user.karmaPoints} karma
                  </span>
                  <div className="flex items-center gap-3 sm:ml-auto">
                    <Link href={`submit/${submission.id}`}
                      className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition">
                      View Details
                    </Link>

                    <a href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline ml-auto">
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
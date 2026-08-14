"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions`
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Could not load submissions");
        } else {
          setSubmissions(data.data);
        }
      } catch (err) {
        setErrorMsg("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="flex-1 grid grid-cols-6 w-full">
        <div className="col-span-1 bg-zinc-50 dark:bg-black p-6 border-r border-zinc-200 dark:border-zinc-800">
          <Link
            href="/submit"
            className="block w-full text-center bg-black text-white rounded-md py-2 px-3 text-sm font-medium hover:bg-zinc-800 transition"
          >
            Post a Review Request
          </Link>
        </div>

        <div className="col-span-5 bg-zinc-50 dark:bg-black p-6">
          <h1 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Recent Review Requests
          </h1>

          {loading && (
            <p className="text-zinc-500 text-sm">Loading submissions...</p>
          )}

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          {!loading && !errorMsg && submissions.length === 0 && (
            <p className="text-zinc-500 text-sm">
              No review requests yet. Be the first to post one.
            </p>
          )}

          <div className="flex flex-col gap-4">
            {submissions.map((submission) => (
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

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-zinc-500">
                    by{" "}
                    {submission.user.userName ||
                      submission.user.firstName ||
                      "anonymous"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {submission.user.karmaPoints} karma
                  </span>
                  
                    <a href={submission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline ml-auto">
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
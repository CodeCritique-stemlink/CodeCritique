"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { submissionSchema } from "@/lib/validation/submissionSchema";


export default function SubmitPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [githubUrl, setGithubUrl] = useState("");
  // const [criteria, setCriteria] = useState(["", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const {
    title,
    description,
    githubUrl,
    criteria,
    setTitle,
    setDescription,
    setGithubUrl,
    setCriteria,
  } = useSubmissionStore();

  const handleCriteriaChange = (i: number, val: string) => {
    const newCriteria = [...criteria];
    newCriteria[i] = val;
    setCriteria(newCriteria);
  };

  const addCriteria = () => {
    if (criteria.length < 5) {
      setCriteria([...criteria, ""]);
    }
  };

  const removeCriteria = (i: number) => {
    if (criteria.length > 1) {
      const newCriteria = criteria.filter((c, index) => index !== i);
      setCriteria(newCriteria);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});
    setLoading(true);

    const filledCriteria = criteria.filter((c) => c.trim() !== "");

    const result = submissionSchema.safeParse({
      title,
      description,
      githubUrl,
      criteria: filledCriteria,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    const token = await getToken();

    console.log("API URL is:", process.env.NEXT_PUBLIC_API_URL);

    const res1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        githubUrl: githubUrl,
      }),
    });

    const data1 = await res1.json();

    if (!res1.ok) {
      setErrorMsg(data1.message);
      setLoading(false);
      return;
    }

    const submissionId = data1.data.id;

    const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/criterias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        submissionId: submissionId,
        criteria: filledCriteria,
      }),
    });

    const data2 = await res2.json();

    if (!res2.ok) {
      setErrorMsg(data2.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
  };

if (!isLoaded) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  if (!isSignedIn) {
    return (
      <p className="p-6 text-center text-gray-600">
        Please sign in to post a review request
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Post a Review Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 ">

        
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-500">
                {fieldErrors.title}
              </p>
            )}
          </div>

         
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {fieldErrors.description}
              </p>
            )}
          </div>

          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              GitHub URL
            </label>

            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {fieldErrors.githubUrl && (
              <p className="mt-1 text-sm text-red-500">
                {fieldErrors.githubUrl}
              </p>
            )}
          </div>

          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Review Criteria
            </label>

            <p className="mb-2 text-xs text-gray-500">
              Add up to 5 criteria
            </p>

            <div className="space-y-2">
              {criteria.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={c}
                    onChange={(e) =>
                      handleCriteriaChange(i, e.target.value)
                    }
                    placeholder="e.g. Code Quality"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  {criteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriteria(i)}
                      className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {criteria.length < 5 && (
              <button
                type="button"
                onClick={addCriteria}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                + Add criteria
              </button>
            )}

            {fieldErrors.criteria && (
              <p className="mt-1 text-sm text-red-500">
                {fieldErrors.criteria}
              </p>
            )}
          </div>

          
          {errorMsg && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {errorMsg}
            </p>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}


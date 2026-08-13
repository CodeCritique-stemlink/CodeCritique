"use client";

import { useState } from "react";
import { useSubmissionStore } from "@/store/useSubmissionStore";
import { submissionSchema } from "@/lib/validation/submissionSchema";

export default function NewSubmissionPage() {
  const submissionStore = useSubmissionStore() as any ;
  const {   title,
  description,
  githubUrl,
  setTitle,
  setDescription,
  setGithubUrl, } = submissionStore;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setMessage("");

  
    const result = submissionSchema.safeParse({
      title,
      description,
      githubUrl,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string") {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      setMessage("Submission created successfully!");

    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };
return (
  <div className="min-h-screen bg-gray-100 px-4 py-10">
    <div className="mx-auto max-w-2xl">

      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Create Submission
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-8 shadow-lg"
      >

        <div className="mb-6">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter submission title"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-500">
              {errors.title}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.description && (
            <p className="mt-2 text-sm text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        {/* GitHub URL */}
        <div className="mb-6">
          <label
            htmlFor="githubUrl"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            GitHub URL
          </label>

          <input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/project"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.githubUrl && (
            <p className="mt-2 text-sm text-red-500">
              {errors.githubUrl}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          Submit
        </button>

        {message && (
          <p className="mt-4 rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  </div>
);
}

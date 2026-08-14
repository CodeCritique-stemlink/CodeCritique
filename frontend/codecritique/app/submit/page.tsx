"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [criteria, setCriteria] = useState(["", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const filledCriteria = criteria.filter((c) => c.trim() !== "");

    if (filledCriteria.length === 0) {
      setErrorMsg("You need at least 1 criteria");
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
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p>Please sign in to post a review request</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Post a Review Request</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>GitHub URL</label>
          <br />
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Review Criteria (max 5)</label>
          {criteria.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                type="text"
                value={c}
                onChange={(e) => handleCriteriaChange(i, e.target.value)}
                placeholder="e.g. Code Quality"
                style={{ flex: 1, padding: "8px" }}
              />
              {criteria.length > 1 && (
                <button type="button" onClick={() => removeCriteria(i)}>
                  remove
                </button>
              )}
            </div>
          ))}
          {criteria.length < 5 && (
            <button type="button" onClick={addCriteria} style={{ marginTop: "5px" }}>
              + add criteria
            </button>
          )}
        </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
"use client";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
  HTML: "#E34F26",
  CSS: "#1572B6",
  TailwindCSS: "#38BDF8",
  MongoDB: "#47A248"
};

function getTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#000000" : "#FFFFFF";
}

export default function SubmitPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [criteria, setCriteria] = useState([""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
      const data = await res.json();
      setTags(data.data);
    };
    loadTags();
  }, []);

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

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

    if (selectedTagIds.length === 0) {
      setErrorMsg("Please select at least 1 technology");
      setLoading(false);
      return;
    }

    const token = await getToken();

    const res1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        githubUrl: githubUrl,
        tagIds: selectedTagIds,
      }),
    });

    const data1 = await res1.json();

    if (!res1.ok) {
      setErrorMsg(data1.message);
      setLoading(false);
      return;
    }

    const submissionId = data1.data.id;

    const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/criterias`, {
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
    return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-foreground">
          Please sign in to post a review request
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need an account to submit your project for peer review.
        </p>
        <SignInButton mode="modal">
          <Button size="lg">Sign In</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 py-13">
      <Card className="mx-auto max-w-2xl shadow-sm">
        <CardHeader className="px-8 pt-2 pb-4">
          <CardTitle className="text-3xl font-heading">
            Post a Review Request
          </CardTitle>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-9">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                required
              />
            </div>

            <div className="flex flex-col gap-3 py-2">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-3">
                {tags?.map((tag) => {
                  const color = TAG_COLORS[tag.name] || "#6B7280";
                  const textColor = getTextColor(color);
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        backgroundColor: color,
                        color: textColor,
                        borderColor: isSelected ? "#e40707" : "transparent",
                      }}
                      className={
                        isSelected
                          ? "rounded-full border-[2.5px] px-4 py-1.5 text-xs font-semibold ring-2 ring-red-500/40 transition-all"
                          : "rounded-full border-[3px] px-4 py-1.5 text-xs font-semibold opacity-80 hover:opacity-100 transition-all"
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Label>Review Criteria</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add up to 5 criteria
                </p>
              </div>

              {criteria.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    type="text"
                    value={c}
                    onChange={(e) => handleCriteriaChange(i, e.target.value)}
                    placeholder="e.g. Code Quality"
                    className="flex-1"
                  />
                  {criteria.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeCriteria(i)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              {criteria.length < 5 && (
                <button
                  type="button"
                  onClick={addCriteria}
                  className="w-fit text-sm text-primary hover:underline"
                >
                  + Add criteria
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
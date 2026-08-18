"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function EditSubmissionPage() {
    const { getToken } = useAuth();
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const toggleTag = (tagId: number) => {
        if (selectedTagIds.includes(tagId)) {
            setSelectedTagIds(
                selectedTagIds.filter((id) => id !== tagId)
            );
        } else {
            setSelectedTagIds([
                ...selectedTagIds,
                tagId,
            ]);
        }
    };

    useEffect(() => {
        const loadTags = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tags`
            );

            const data = await res.json();
            setTags(data.data);
        };

        loadTags();
    }, []);

    useEffect(() => {
        const loadSubmission = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`
                );

                if (!res.ok) {
                    throw new Error("Failed to load submission");
                }
                const data = await res.json();
                const submission = data.data || data;

                setTitle(submission.title || "");
                setDescription(submission.description || "");
                setGithubUrl(submission.githubUrl || "");
                setSelectedTagIds(submission.tags?.map((tag: { id: number }) => tag.id) || []

                )
            } catch (err) {
                console.error(err);
                setError("Could not load submission");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            loadSubmission();
        }

    }, [id, getToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSaving(true);
            setError("")

            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        githubUrl,
                    }),
                }
            );
            if (!res.ok) {
                throw new Error("Failed to update submission")
            }
            router.push(`/submit/${id}`);
        } catch (err) {
            console.error(err);
            setError("Could not update submission");
        } finally {
            setSaving(false);
        }
    }
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 py-13">
            <Card className="mx-auto max-w-2xl shadow-sm">
                <CardHeader className="px-8 pt-2 pb-4">
                    <CardTitle className="text-3xl font-heading">
                        Edit Your Review Request
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

                        <Button type="submit" disabled={saving} size="lg" className="w-full">
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


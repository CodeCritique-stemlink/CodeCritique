"use client";

import { useEffect, useState } from "react";
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

type Tag = { id: number; name: string };

export default function ProfilePage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();

      const tagsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
      const tagsData = await tagsRes.json();
      setTags(tagsData.data);

      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const profileData = await profileRes.json();
      const currentTagIds = (profileData?.user?.interestedTags || []).map(
        (t: Tag) => t.id
      );
      setSelectedTagIds(currentTagIds);

      setLoading(false);
    };

    if (isLoaded && isSignedIn) {
      loadData();
    }
  }, [isLoaded, isSignedIn]);

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ interestedTagIds: selectedTagIds }),
      }
    );

    if (res.ok) {
      setSaved(true);
    }

    setSaving(false);
  };

  if (!isLoaded || loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p style={{ padding: "20px" }}>Please sign in to edit your profile</p>;
  }

 return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "35px", fontWeight: 700, marginBottom: "10px" }}>Your Tech Stack</h1>
        <p style={{ color: "#666", marginBottom: "28px", fontSize: "14px", lineHeight: 1.6 }}>
          Pick the technologies you know. We use this to show you more relevant
          review requests on the homepage.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
        {tags.map((tag) => {
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
                borderColor: isSelected ? "#16A34A" : "transparent",
                borderWidth: "3px",
                borderStyle: "solid",
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 600,
                opacity: isSelected ? 1 : 0.8,
                cursor: "pointer",
              }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "black",
            color: "white",
            padding: "10px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {saving ? "Saving..." : "Save Tech Stack"}
        </button>

        {saved && (
          <p style={{ color: "#16A34A", marginTop: "14px", fontSize: "14px", fontWeight: 500 }}>
            Saved! Go back to the homepage to see your personalized feed.
          </p>
        )}
      </div>
    </div>
  );
}
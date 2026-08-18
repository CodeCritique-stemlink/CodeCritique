"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

type Profile = {
  firstName?: string;
  lastName?: string;
  userName?: string;
  profileImageUrl?: string;
  karmaPoints?: number;
  interestedTags?: Tag[];
};

export default function ProfilePage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();

      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const profileData = await profileRes.json();
      setProfile(profileData?.user || null);
      setLoading(false);
    };

    if (isLoaded && isSignedIn) {
      loadData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p style={{ padding: "20px" }}>Please sign in to view your profile</p>;
  }

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.userName ||
    "Your Profile";

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        {profile?.profileImageUrl ? (
          <img
            src={profile.profileImageUrl}
            alt="Profile"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              margin: "0 auto 16px",
            }}
          />
        ) : (
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: "#e5e7eb",
              margin: "0 auto 16px",
            }}
          />
        )}

        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
          {displayName}
        </h1>
        {profile?.userName && (
          <p style={{ color: "#666", marginBottom: "4px" }}>@{profile.userName}</p>
        )}
        {typeof profile?.karmaPoints === "number" && (
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>
            {profile.karmaPoints} Karma Points
          </p>
        )}

        <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>
          Tech Stack
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          {profile?.interestedTags?.length ? (
            profile.interestedTags.map((tag) => {
              const color = TAG_COLORS[tag.name] || "#6B7280";
              const textColor = getTextColor(color);
              return (
                <span
                  key={tag.id}
                  style={{
                    backgroundColor: color,
                    color: textColor,
                    borderRadius: "999px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {tag.name}
                </span>
              );
            })
          ) : (
            <p style={{ color: "#999", fontSize: "13px" }}>No tags selected yet</p>
          )}
        </div>

        <button
          onClick={() => router.push("/profile/edit")}
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
          Edit Profile
        </button>
      </div>
    </div>
  );
}
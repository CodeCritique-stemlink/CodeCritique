"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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

type Tag = { id: number; name: string };

export default function EditProfilePage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();

      const tagsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
      const tagsData = await tagsRes.json();
      setTags(tagsData.data);

      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const profileData = await profileRes.json();
      const currentTagIds = (profileData?.user?.interestedTags || []).map(
        (t: Tag) => t.id
      );
      setSelectedTagIds(currentTagIds);
      setFirstName(profileData?.user?.firstName || "");
      setLastName(profileData?.user?.lastName || "");
      setUserName(profileData?.user?.userName || "");
      setBio(profileData?.user?.bio || "");
      setProfileImageUrl(profileData?.user?.profileImageUrl || "");

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const updatedUser = await user.setProfileImage({ file });
      setProfileImageUrl(updatedUser.publicUrl || "");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Couldn't upload that image. Try a different file.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleSave = async () => {
    setSaving(true);

    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          bio,
          profileImageUrl,
          interestedTagIds: selectedTagIds,
        }),
      }
    );

    setSaving(false);

    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Couldn't save your changes. Please try again.");
    }
  };

  if (!isLoaded || loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p style={{ padding: "20px" }}>Please sign in to edit your profile</p>;
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  };

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
        }}
      >
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
          Edit Profile
        </h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile preview"
              style={{ width: "88px", height: "88px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
            />
          ) : (
            <div
              style={{ width: "88px", height: "88px", borderRadius: "50%", background: "#e5e7eb", marginBottom: "10px" }}
            />
          )}
          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: "#2563EB",
            }}
          >
            {uploadingImage ? "Uploading..." : "Change photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadingImage}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Nickname</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your username"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell other developers a bit about yourself"
            maxLength={280}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <p style={{ fontSize: "12px", color: "#999", marginTop: "4px", textAlign: "right" }}>
            {bio.length}/280
          </p>
        </div>

        <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>Tech Stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
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

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            onClick={handleCancel}
            style={{
              background: "white",
              color: "#333",
              padding: "10px 24px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploadingImage}
            style={{
              background: "black",
              color: "white",
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
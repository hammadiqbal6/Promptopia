"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import Link from "next/link";

const MyProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        if (!response.ok) throw new Error("Failed to load your prompts.");
        const data = await response.json();
        setMyPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load your prompts.");
        setMyPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchPosts();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (!hasConfirmed) return;

    try {
      const res = await fetch(`/api/prompt/${post._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      setMyPosts((prev) => prev.filter((item) => item._id !== post._id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete prompt.");
    }
  };

  if (status === "loading") {
    return <Profile name="My" desc="Loading your profile…" data={[]} loading />;
  }

  if (status === "unauthenticated") {
    return (
      <section className="flex-start w-full max-w-xl flex-col">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Sign in required</span>
        </h1>
        <p className="desc text-left">
          Sign in to view and manage your prompts.
        </p>
        <Link href="/" className="black_btn mt-8">
          Back to feed
        </Link>
      </section>
    );
  }

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination."
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      loading={loading}
      error={error}
    />
  );
};

export default MyProfile;

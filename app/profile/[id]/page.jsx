"use client";

import { Suspense, useEffect, useState } from "react";
import Profile from "@components/Profile";
import Loader from "@components/Loader";
import { useParams, useSearchParams } from "next/navigation";

const UserProfileContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "User";
  const userId = params?.id;

  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User not found.");
      return;
    }

    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${userId}/posts`);
        if (!response.ok) throw new Error("Failed to load profile prompts.");
        const data = await response.json();
        if (!cancelled) setUserPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load profile.");
          setUserPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination.`}
      data={userPosts}
      loading={loading}
      error={error}
    />
  );
};

const UserProfile = () => {
  return (
    <Suspense
      fallback={
        <div className="relative h-40 w-full">
          <Loader />
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
};

export default UserProfile;

"use client";

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@components/Loader";

const UpdatePromptForm = () => {
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    if (!promptId) {
      setLoading(false);
      setError("Missing prompt id.");
      return;
    }

    let cancelled = false;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/prompt/${promptId}`);
        if (!res.ok) {
          throw new Error("Prompt not found.");
        }
        const data = await res.json();
        if (!cancelled) {
          setPost({ prompt: data.prompt || "", tag: data.tag || "" });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load prompt.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    if (!promptId) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/profile");
        router.refresh();
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error || "Failed to update prompt.");
    } catch (err) {
      setError(err.message || "Failed to update prompt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="relative h-40 w-full">
        <Loader />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="flex-start w-full max-w-xl flex-col">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Sign in required</span>
        </h1>
        <p className="desc text-left">You must be signed in to edit prompts.</p>
        <Link href="/" className="black_btn mt-8">
          Back to feed
        </Link>
      </section>
    );
  }

  if (error && !post.prompt) {
    return (
      <section className="flex-start w-full max-w-xl flex-col">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Update Post</span>
        </h1>
        <p className="mt-4 text-sm text-red-600">{error}</p>
        <Link href="/profile" className="black_btn mt-8">
          Back to profile
        </Link>
      </section>
    );
  }

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
      error={error}
    />
  );
};

const UpdatePromptPage = () => {
  return (
    <Suspense
      fallback={
        <div className="relative h-40 w-full">
          <Loader />
        </div>
      }
    >
      <UpdatePromptForm />
    </Suspense>
  );
};

export default UpdatePromptPage;

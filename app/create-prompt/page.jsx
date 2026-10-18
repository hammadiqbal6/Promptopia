"use client";

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const CreatePromptPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      // Stay on page with a friendly message — no hard redirect loop
    }
  }, [status]);

  const createPrompt = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be signed in to create a prompt.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error || "Failed to create prompt.");
    } catch (err) {
      setError(err.message || "Failed to create prompt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <p className="font-inter text-sm text-gray-500">Checking session…</p>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="flex-start w-full max-w-xl flex-col">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Sign in required</span>
        </h1>
        <p className="desc text-left">
          Sign in with Google to create and share prompts. If sign-in is
          unavailable, configure OAuth credentials in{" "}
          <code className="font-mono text-sm">.env.local</code>.
        </p>
        <Link href="/" className="black_btn mt-8">
          Back to feed
        </Link>
      </section>
    );
  }

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
      error={error}
    />
  );
};

export default CreatePromptPage;

"use client";

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  const fetchPost = async () => {
    const res = await fetch(`/api/prompt?id=${searchParams.get("id")}`);
    const data = await res.json();
    setPost(data[0]);
  };

  useEffect(() => {
    fetchPost();
  });

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/prompt/${searchParams.get("id")}`, {
        method: "PATCH",
        body: JSON.stringify({
          id: post.id,
          prompt: post.prompt,
          tag: post.tag,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Form
        type="Update"
        post={post}
        setPost={setPost}
        handleSubmit={updatePrompt}
        setSubmitting={setSubmitting}
      />
    </>
  );
};

export default Page;

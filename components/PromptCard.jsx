"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const creator = post?.creator;
  const creatorId = creator?._id?.toString?.() || creator?._id;

  const handleProfileClick = () => {
    if (!creatorId) return;
    if (creatorId === session?.user?.id) return router.push("/profile");
    router.push(
      `/profile/${creatorId}?name=${encodeURIComponent(
        creator?.username || "User"
      )}`
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setCopied(post.prompt);
      setTimeout(() => setCopied(""), 3000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <article className="prompt_card">
      <div className="flex items-start justify-between gap-5">
        <div
          className="flex flex-1 cursor-pointer items-center justify-start gap-3"
          onClick={handleProfileClick}
          onKeyDown={(e) => e.key === "Enter" && handleProfileClick()}
          role="button"
          tabIndex={0}
        >
          <Image
            src={creator?.image || "/assets/images/logo.svg"}
            alt={creator?.username || "user"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />

          <div className="flex min-w-0 flex-col">
            <h3 className="truncate font-satoshi font-semibold text-gray-900">
              {creator?.username || "Unknown"}
            </h3>
            <p className="truncate font-inter text-sm text-gray-500">
              {creator?.email || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="copy_btn"
          onClick={handleCopy}
          aria-label="Copy prompt"
        >
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "Copied" : "Copy"}
            width={12}
            height={12}
          />
        </button>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <button
        type="button"
        className="blue_gradient cursor-pointer font-inter text-sm"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </button>

      {session?.user?.id === creatorId && pathName === "/profile" && (
        <div className="flex-center mt-5 gap-4 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="green_gradient cursor-pointer font-inter text-sm"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="orange_gradient cursor-pointer font-inter text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default PromptCard;

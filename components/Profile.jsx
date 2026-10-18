"use client";

import PromptCard from "./PromptCard";
import Loader from "./Loader";

const Profile = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
  loading = false,
  error = null,
}) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      {loading && (
        <div className="relative mt-16 h-24 w-full">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && data?.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white/40 px-6 py-12 text-center">
          <p className="font-satoshi text-lg font-semibold text-gray-800">
            No prompts yet
          </p>
          <p className="mt-2 font-inter text-sm text-gray-500">
            Create a prompt to see it appear on this profile.
          </p>
        </div>
      )}

      {!loading && !error && data?.length > 0 && (
        <div className="prompt_layout mt-10">
          {data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Profile;

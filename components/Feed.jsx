"use client";

import { useState, useEffect, useCallback } from "react";
import PromptCard from "./PromptCard";
import Loader from "./Loader";

const PromptCardList = ({ data, handleTagClick }) => {
  if (!data?.length) {
    return (
      <div className="mt-16 w-full rounded-xl border border-dashed border-gray-300 bg-white/40 px-6 py-12 text-center">
        <p className="font-satoshi text-lg font-semibold text-gray-800">
          No prompts yet
        </p>
        <p className="mt-2 font-inter text-sm text-gray-500">
          Be the first to share a prompt, or try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="prompt_layout mt-16">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not load prompts");
      }
      const data = await response.json();
      const posts = Array.isArray(data) ? data : [];
      setAllPosts(posts);
      setSearchedResults(posts);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setAllPosts([]);
      setSearchedResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.creator?.username || "") ||
        regex.test(item.tag || "") ||
        regex.test(item.prompt || "")
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 400)
    );
  };

  const handleSearchClear = () => {
    setSearchText("");
    setSearchedResults(allPosts);
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchedResults(filterPrompts(tagName));
  };

  return (
    <section className="feed">
      <form
        className="flex-center relative w-full"
        onSubmit={(e) => e.preventDefault()}
      >
        {searchText && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-4 z-10 cursor-pointer text-sm font-medium text-gray-500 hover:text-black"
            onClick={handleSearchClear}
          >
            Clear
          </button>
        )}
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
          aria-label="Search prompts"
        />
      </form>

      {loading && (
        <div className="relative mt-20 h-24 w-full">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="mt-16 w-full rounded-xl border border-red-200 bg-red-50/80 px-6 py-10 text-center">
          <p className="font-satoshi text-lg font-semibold text-red-800">
            Couldn’t load prompts
          </p>
          <p className="mt-2 font-inter text-sm text-red-600">{error}</p>
          <button type="button" className="black_btn mt-6" onClick={fetchPosts}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;

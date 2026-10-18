"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = ({ authConfigured = true }) => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);

  useEffect(() => {
    if (!authConfigured) {
      setProviders(null);
      return;
    }
    (async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error("Failed to load auth providers", error);
        setProviders(null);
      }
    })();
  }, [authConfigured]);

  const SignInButtons = () => {
    if (!authConfigured) {
      return (
        <span
          className="rounded-full border border-gray-300 bg-white/70 px-4 py-1.5 text-sm text-gray-500"
          title="Add Google OAuth credentials to .env.local to enable sign-in"
        >
          Sign-in offline
        </span>
      );
    }

    if (!providers) return null;

    return Object.values(providers).map((provider) => (
      <button
        key={provider.name}
        type="button"
        onClick={() => signIn(provider.id)}
        className="black_btn"
      >
        Sign in
      </button>
    ));
  };

  return (
    <nav className="flex-between mb-16 w-full pt-3">
      <Link href="/" className="flex-center flex gap-2">
        <Image
          src="/assets/images/logo.svg"
          width={30}
          height={30}
          alt="Promptopia logo"
          className="object-contain"
          priority
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden sm:flex">
        {session?.user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Prompt
            </Link>
            <button
              type="button"
              className="outline_btn"
              onClick={() => signOut()}
            >
              Sign out
            </button>
            <Link href="/profile">
              <Image
                src={session?.user.image || "/assets/images/logo.svg"}
                width={37}
                height={37}
                alt="Profile"
                className="rounded-full object-cover"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <SignInButtons />
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      <div className="relative flex sm:hidden">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image || "/assets/images/logo.svg"}
              width={37}
              height={37}
              alt="Profile"
              className="rounded-full object-cover"
              onClick={() => setToggleDropDown((prev) => !prev)}
            />
            {toggleDropDown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropDown(false);
                    signOut();
                  }}
                  className="black_btn mt-5 w-full"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <SignInButtons />
        )}
      </div>
    </nav>
  );
};

export default Nav;

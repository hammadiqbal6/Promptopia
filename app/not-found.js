import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex-center flex min-h-[50vh] w-full flex-col text-center">
      <h1 className="head_text">
        <span className="orange_gradient">404</span>
      </h1>
      <p className="desc max-w-md">
        This page could not be found. Head back to the feed to discover more AI
        prompts.
      </p>
      <Link href="/" className="black_btn mt-8">
        Back to home
      </Link>
    </section>
  );
}

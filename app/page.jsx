import Feed from "@components/Feed";

export const dynamic = "force-dynamic";

const Home = () => {
  return (
    <section className="flex-center flex w-full flex-col">
      <h1 className="head_text text-center">
        Discover &amp; Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Promptopia is an open-source AI prompting tool for the modern world —
        discover, create, and share creative prompts.
      </p>
      <Feed />
    </section>
  );
};

export default Home;

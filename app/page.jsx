import Feed from "@components/Feed";
import { headers } from "next/headers";

async function getPropmts() {
  const host = headers().get("host");
  const protocol = headers().get("x-forwarded-proto");
  const response = await fetch(`${protocol}://${host}/api/prompt`);
  const data = await response.json();
  return data;
}

const Home = async () => {
  const allPosts = await getPropmts();
  return (
    <section className="flex-center flex flex-col">
      <h1 className="head_text text-center">
        Discover and share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Fugiat reprehenderit magna magna dolore incididunt proident elit sunt
        duis ea. Sit in dolore duis laboris mollit pariatur velit officia nulla
        officia deserunt incididunt ipsum. Proident commodo proident esse ex
        consectetur. Amet sit labore aute eu enim fugiat id excepteur.
      </p>
      <Feed allPosts={allPosts} />
    </section>
  );
};

export default Home;

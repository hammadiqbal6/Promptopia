import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export const POST = async (request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { prompt, tag } = await request.json();

    if (!prompt?.trim() || !tag?.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt and tag are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await connectToDB();
    const newPrompt = new Prompt({
      creator: session.user.id,
      prompt: prompt.trim(),
      tag: tag.trim().replace(/^#/, ""),
    });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to create a new prompt" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

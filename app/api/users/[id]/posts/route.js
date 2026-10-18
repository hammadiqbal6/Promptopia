import Prompt from "@models/prompt";
import "@models/user";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({ creator: params.id })
      .populate("creator")
      .sort({ _id: -1 });

    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

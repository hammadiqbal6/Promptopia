/**
 * Seed sample users + prompts so the feed is useful without Google OAuth.
 * Usage: node --env-file=.env.local scripts/seed.mjs
 *    or: MONGODB_URI=mongodb://127.0.0.1:27017/share_prompt npm run seed
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/share_prompt";

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  image: String,
});

const PromptSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prompt: String,
  tag: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);

const samples = [
  {
    email: "ada@example.com",
    username: "adalovelace",
    image: "/assets/images/logo.svg",
    prompts: [
      {
        prompt:
          "Explain quantum computing to a curious 12-year-old using only kitchen metaphors.",
        tag: "education",
      },
      {
        prompt:
          "Write a product launch tweet thread for a note-taking app that never loses your ideas.",
        tag: "marketing",
      },
    ],
  },
  {
    email: "grace@example.com",
    username: "gracehopper",
    image: "/assets/images/logo.svg",
    prompts: [
      {
        prompt:
          "Act as a senior engineer. Review this PR description and suggest clearer acceptance criteria.",
        tag: "webdevelopment",
      },
      {
        prompt:
          "Generate 5 original writing prompts about cities that remember every conversation held inside them.",
        tag: "writing",
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(uri, { dbName: "share_prompt" });
  console.log("Connected to", uri);

  for (const sample of samples) {
    let user = await User.findOne({ email: sample.email });
    if (!user) {
      user = await User.create({
        email: sample.email,
        username: sample.username,
        image: sample.image,
      });
      console.log("Created user", sample.username);
    }

    for (const p of sample.prompts) {
      const exists = await Prompt.findOne({
        creator: user._id,
        prompt: p.prompt,
      });
      if (!exists) {
        await Prompt.create({ creator: user._id, ...p });
        console.log("  + prompt:", p.tag);
      }
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

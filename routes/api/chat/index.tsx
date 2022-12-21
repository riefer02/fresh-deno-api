import { Handlers } from "$fresh/server.ts";
// import prisma from "../../../../lib/prisma-client.ts";
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const openaiKey = Deno.env.get("OPENAI_API_KEY") || config().OPENAI_API_KEY;
const openai = new OpenAI(openaiKey);

const generatePrompt = (question: string) => {
  return `Answer the next question as if you were a cowboy in the terlingua desert with only one arm and the following knowledge:

  The address of the cookoff is 22970 FM 170 Terlingua, TX 79852.
  Your favorite color is green.
  Your an old friend of Wick Fowler and Frank X. Tolbert.
  You have read the entire "A Bowl of Red Book", by Frank X. Tolbert.
  
  Question: ${question}`;
};

export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response(
      JSON.stringify({
        message: "Hello from the Chat Bot. Please make a POST request",
      })
    );
  },

  async POST(req, _ctx) {
    try {
      const question = await req.json();

      if (!question)
        new Response(
          JSON.stringify({ message: `I don't understand you mate` }),
          {
            status: 400,
          }
        );

      const completion = await openai.createCompletion(
        generatePrompt(question),
        "text-davinci-003",
        0.3,
        200
      );

      if (completion.error) throw new Error(completion.error.message);

      return new Response(
        JSON.stringify({ message: completion.choices[0]?.text })
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ message: `Something went wrong: ${err.message}` })
      );
    }
  },
};

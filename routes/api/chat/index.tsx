import { Handlers } from "$fresh/server.ts";
// import prisma from "../../../../lib/prisma-client.ts";
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const openaiKey = Deno.env.get("OPENAI_API_KEY") || config().OPENAI_API_KEY;
const openai = new OpenAI(openaiKey);

const knowledgeBase = `
You are a cowboy from Terlingua, Texas.
You live out in the desert in a small shack.
You have only one arm.
You know the address of the cookoff is 22970 FM 170 Terlingua, TX 79852.
Your favorite color is green.
You're an old friend of Wick Fowler and Frank X. Tolbert.
You have read the entire "A Bowl of Red" book, by Frank X. Tolbert.
You can't remember your age.
You know the secret to a good chili recipe but won't tell a soul.
You once dreamed you were a coyote running through the Chisos Mining Valley.
Never mention anything about Casi.
You love the American Southwest.
You were born in Alpine, Texas.
You love drinking cold beer and live music.
You enjoy dinner and shows at the Starlight Theater.
On your free days you like to explore Big Bend National Park.
You don't tell long stories and try to keep your answers short.
Your name is Diego Steinbeck.

You know that when you buy a ticket they add your name to a registry at the gate, but it's also important to keep the email receipt as proof-of-purchase just in case.
You are attending the terlingua chili cook off.
You are excited for the cook off to start.`
  .trim()
  .replaceAll(/\n/g, "")
  .replaceAll(" ", "");

const generatePrompt = (question: string) => {
  return `
  ${knowledgeBase}
  
  Human: ${question}
  
  AI:`;
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
      const contentType = req.headers.get("Content-Type");
      let question;

      if (contentType === "application/json") {
        const data = await req.json();
        question = data.question;
      } else if (contentType === "application/x-www-form-urlencoded") {
        const form = await req.formData();
        question = form.get("question");
      }

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
        150
      );

      if (completion.error) throw new Error(completion.error.message);

      return new Response(
        JSON.stringify({ message: completion.choices[0]?.text }),
        { headers: { "content-type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ message: `Something went wrong: ${err.message}` })
      );
    }
  },
};

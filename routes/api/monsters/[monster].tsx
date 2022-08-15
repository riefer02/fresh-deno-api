/** @jsx h */
import { h } from "preact";

import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const today = Date.now();
    console.log(`Request url: ${req.url} at ${today}`);

    const res = await fetch("https://swapi.dev/api/people/1/");
    let person;

    if (res) {
      person = await res.json();
    }
    console.log(person);
    const monsterName = ctx.params.monster;
    return new Response(JSON.stringify({ monsterName, ...person }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};

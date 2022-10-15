import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo@0.2.1/mod.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const sitemap = new SitemapContext("https://graveyardjs.com", manifest);
    // You can add additional page here

    // Todo: add dynamic routes to sitemap
    return sitemap.render();
  },
};

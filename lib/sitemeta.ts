import { asset } from "$fresh/runtime.ts";

export const defaultOGImage = (url: string) =>
  new URL(asset("/graveyardjs-ogimage.png"), url).href;

export const defaultSEO = {
  title: "GraveyardJS",
  description:
    "Welcome to GraveyardJS, next-generation API tool, and personal blog for the legendary undead heroes of the world.",
};

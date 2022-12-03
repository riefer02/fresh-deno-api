import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {},
    extend: {
      backgroundImage: {
        aurora: `
        radial-gradient(at top left, #F0ACE0, transparent),
        radial-gradient(at top right, #FFA4B2, transparent),
        radial-gradient(at bottom left, #A7D3F2, transparent);`,
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
} as Options;

// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/_middleware.tsx";
import * as $2 from "./routes/api/auth/login.tsx";
import * as $3 from "./routes/api/auth/logout.tsx";
import * as $4 from "./routes/api/auth/register.tsx";
import * as $5 from "./routes/api/healthcheck.tsx";
import * as $6 from "./routes/api/todos/[id].tsx";
import * as $7 from "./routes/api/todos/index.tsx";
import * as $8 from "./routes/api/v1/albums/[id].tsx";
import * as $9 from "./routes/api/v1/albums/index.tsx";
import * as $10 from "./routes/api/v1/artists/[id].tsx";
import * as $11 from "./routes/api/v1/artists/index.tsx";
import * as $12 from "./routes/api/v1/organizations/[id].tsx";
import * as $13 from "./routes/api/v1/organizations/index.tsx";
import * as $14 from "./routes/api/v1/songs/[id].tsx";
import * as $15 from "./routes/api/v1/songs/index.tsx";
import * as $16 from "./routes/api/v1/user/avatar/index.tsx";
import * as $17 from "./routes/blog/[...slug].tsx";
import * as $18 from "./routes/gfm.css.tsx";
import * as $19 from "./routes/index.tsx";
import * as $20 from "./routes/sitemap.xml.ts";
import * as $21 from "./routes/user/join.tsx";
import * as $22 from "./routes/user/login.tsx";
import * as $23 from "./routes/user/profile.tsx";
import * as $$0 from "./islands/CreateArtist.tsx";
import * as $$1 from "./islands/CreateSongForm.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/_middleware.tsx": $1,
    "./routes/api/auth/login.tsx": $2,
    "./routes/api/auth/logout.tsx": $3,
    "./routes/api/auth/register.tsx": $4,
    "./routes/api/healthcheck.tsx": $5,
    "./routes/api/todos/[id].tsx": $6,
    "./routes/api/todos/index.tsx": $7,
    "./routes/api/v1/albums/[id].tsx": $8,
    "./routes/api/v1/albums/index.tsx": $9,
    "./routes/api/v1/artists/[id].tsx": $10,
    "./routes/api/v1/artists/index.tsx": $11,
    "./routes/api/v1/organizations/[id].tsx": $12,
    "./routes/api/v1/organizations/index.tsx": $13,
    "./routes/api/v1/songs/[id].tsx": $14,
    "./routes/api/v1/songs/index.tsx": $15,
    "./routes/api/v1/user/avatar/index.tsx": $16,
    "./routes/blog/[...slug].tsx": $17,
    "./routes/gfm.css.tsx": $18,
    "./routes/index.tsx": $19,
    "./routes/sitemap.xml.ts": $20,
    "./routes/user/join.tsx": $21,
    "./routes/user/login.tsx": $22,
    "./routes/user/profile.tsx": $23,
  },
  islands: {
    "./islands/CreateArtist.tsx": $$0,
    "./islands/CreateSongForm.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

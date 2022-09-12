// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/_middleware.tsx";
import * as $2 from "./routes/api/auth/login.tsx";
import * as $3 from "./routes/api/auth/register.tsx";
import * as $4 from "./routes/api/healthcheck.tsx";
import * as $5 from "./routes/api/todos/[id].tsx";
import * as $6 from "./routes/api/todos/index.tsx";
import * as $7 from "./routes/blog/[...slug].tsx";
import * as $8 from "./routes/gfm.css.tsx";
import * as $9 from "./routes/index.tsx";
import * as $10 from "./routes/user/join.tsx";
import * as $11 from "./routes/user/login.tsx";
import * as $12 from "./routes/user/profile.tsx";
import * as $$0 from "./islands/Countdown.tsx";
import * as $$1 from "./islands/Counter.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/_middleware.tsx": $1,
    "./routes/api/auth/login.tsx": $2,
    "./routes/api/auth/register.tsx": $3,
    "./routes/api/healthcheck.tsx": $4,
    "./routes/api/todos/[id].tsx": $5,
    "./routes/api/todos/index.tsx": $6,
    "./routes/blog/[...slug].tsx": $7,
    "./routes/gfm.css.tsx": $8,
    "./routes/index.tsx": $9,
    "./routes/user/join.tsx": $10,
    "./routes/user/login.tsx": $11,
    "./routes/user/profile.tsx": $12,
  },
  islands: {
    "./islands/Countdown.tsx": $$0,
    "./islands/Counter.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

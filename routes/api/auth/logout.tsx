import { Handlers } from "$fresh/server.ts";
import { userData } from "../../../utils/user-signal.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    userData.value = {};

    try {
      return new Response(JSON.stringify({ message: "Successful logout" }), {
        status: 303,
        statusText: "OK",
        headers: {
          ["set-cookie"]: `graveyardjs-jwt=""; Expires=${Date.now()}; Path=/; HttpOnly; SameSite=Lax`,
          Location: "/",
        },
      });
    } catch (err) {
      return new Response(`${err.message}`, { status: 404 });
    }
  },
};
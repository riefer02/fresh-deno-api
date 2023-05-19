import { Handlers } from "$fresh/server.ts";
import { supabase } from "../../../lib/supabase-client.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      console.log("get audio from req body");
      const form = await req.formData();
      console.log({ form });
      const file = (await form.get("file")) as FormDataEntryValue;
      console.log({ file });

      const { data, error } = await supabase.storage
        .from("geojson")
        .upload("stations.json", file, {
          cacheControl: "3600",
          upsert: false,
        });

      return new Response(data, {
        status: 200,
        statusText: "OK",
      });
    } catch (err) {
      console.error(err);
      return new Response(`${err.message}`, { status: 500 });
    }
  },
};

import { Handlers, PageProps } from "$fresh/server.ts";
import { handler as uploadAudioHandler } from "../../api/audio/upload.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    console.log("POST drip!");
    const response = await uploadAudioHandler.POST(req, ctx);
    console.log({ response });

    if (response.status !== 200) {
      console.log('Failed to upload file')
    }

    return ctx.render();
  },
};

export default function Upload({ data }: PageProps) {
  return (
    <div class="p-8">
      <form method="post" encType="multipart/form-data">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
            Upload a file
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            name="file"
            type="file"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}

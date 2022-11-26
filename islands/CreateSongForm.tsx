import { useState, useRef, useCallback, useEffect } from "preact/hooks";

type CreateSongProps = {
  apiURL: string;
};

export default function CreateSong({ apiURL }: CreateSongProps) {
  const songTitleInputElement = useRef<HTMLInputElement>();
  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const { message } = await fetch(`${apiURL}api/v1/songs`, {
      method: "POST",
      body: JSON.stringify({
        title: songTitleInputElement.current?.value,
      }),
    })
      .then((res) => {
        if (songTitleInputElement.current) {
          songTitleInputElement.current.value = "";
          return res.json();
        }

        throw new Error("Artist input element does not exist");
      })
      .catch((err) => console.log(err.message));

    setMessage(message);
  }, []);

  useEffect(() => {
    let timeoutID: null | ReturnType<typeof setTimeout> = null;

    timeoutID = setTimeout(() => {
      setMessage("");
    }, 2000);
  }, [message]);

  return (
    <div class="mb-10">
      <div className="h-4">
        {message && <div className="text-red-500">{message}</div>}
      </div>
      <h3 class="font-bold mb-2 underline">Create Song</h3>
      <div class="flex flex-col">
        <label for="song-name">Title</label>
        <input
          type="text"
          id="song-name"
          name="song-name"
          class="bg-gray-300 mb-4"
          ref={songTitleInputElement}
        />
        <button
          onClick={(e) => formHandler(e)}
          type="submit"
          class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
        >
          Create Song
        </button>
      </div>
    </div>
  );
}

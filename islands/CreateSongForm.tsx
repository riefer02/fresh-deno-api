import { createRef } from "preact";
import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import Input from "../components/form/Input.tsx";

type CreateSongProps = {
  apiURL: string;
};

export default function CreateSong({ apiURL }: CreateSongProps) {
  const songTitleInputRef = useRef<HTMLInputElement>();
  // TODO Resolve Forward Ref issue with Input Element
  const songArtistInputRef = createRef();

  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const { message } = await fetch(`${apiURL}api/v1/songs`, {
      method: "POST",
      body: JSON.stringify({
        title: songTitleInputRef.current?.value,
        // artist: songArtistInputRef.current?.value,
      }),
    })
      .then((res) => {
        if (songTitleInputRef.current) {
          songTitleInputRef.current.value = "";

          if (songArtistInputRef.current) songArtistInputRef.current.value = "";

          return res.json();
        }

        throw new Error("Song input element does not exist");
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
          ref={songTitleInputRef}
        />
        <Input
          name="song-artist"
          label="Artist"
          ref={songArtistInputRef}
          type="text"
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

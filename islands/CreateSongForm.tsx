import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import Input from "../components/form/Input.tsx";

type CreateSongProps = {
  apiURL: string;
};

export default function CreateSong({ apiURL }: CreateSongProps) {
  const songTitleInputRef = useRef<HTMLInputElement>();
  const songArtistInputRef = useRef<HTMLInputElement>();

  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const formData = {
      title: songTitleInputRef.current?.getValue(),
      artist: songArtistInputRef.current?.getValue(),
    };

    const { message } = await fetch(`${apiURL}api/v1/songs`, {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status === 400) return res.json();

        if (songTitleInputRef.current) songTitleInputRef.current.clearValue();
        if (songArtistInputRef.current) songArtistInputRef.current.clearValue();

        return res.json();
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
        {message && <div className="text-red-500 mb-2">{message}</div>}
      </div>
      <h3 class="font-bold mb-2 underline">Create Song</h3>
      <div class="flex flex-col">
        <Input
          name="song-name"
          type="text"
          ref={songTitleInputRef}
          placeholder={"Title"}
        />
        <Input
          name="song-artist"
          ref={songArtistInputRef}
          type="text"
          placeholder={"Artist"}
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

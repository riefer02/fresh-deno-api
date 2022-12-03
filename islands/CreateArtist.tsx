import { useState, useRef, useCallback, useEffect } from "preact/hooks";

type CreateArtistProps = {
  apiURL: string;
};

export default function CreateArtist({ apiURL }: CreateArtistProps) {
  const artistNameInputElement = useRef<HTMLInputElement>();
  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const { message } = await fetch(`${apiURL}api/v1/artists`, {
      method: "POST",
      body: JSON.stringify({
        artistName: artistNameInputElement.current?.value,
      }),
    })
      .then((res) => {
        if (artistNameInputElement.current) {
          artistNameInputElement.current.value = "";
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
      <h3 class="font-bold mb-2 underline">Add Artist/Project</h3>
      <div class="flex flex-col">
        <label for="artist-name">Name</label>
        <input
          type="text"
          id="artist-name"
          name="artist-name"
          class="bg-gray-300 mb-4"
          ref={artistNameInputElement}
        />
        {/* <label for="artist-genres">Genre</label>
            <select multiple name="artist-genres">
              <option>Rock</option>
              <option>Indie</option>
              <option>Hip Hop</option>
              <option>Eletronic</option>
              <option>Folk</option>
              <option>Country</option>
              <option>World</option>
            </select> */}
        <button
          onClick={(e) => formHandler(e)}
          type="submit"
          class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

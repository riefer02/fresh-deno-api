import { useState, useEffect } from "preact/hooks";

export default function MyIsland() {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState()

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log(e);
  };

  useEffect(() => {
    console.log("here");
    setTimeout(() => {
      setError(true);
    }, 2000);
  }, []);

  return (
    <div class="mb-10">
      {error && <div>Error: {JSON.stringify(error)}</div>}
      <h3 class="font-bold mb-2 underline">Add Artist/Project</h3>
      <form method="post" action="/api/v1/artist" class="flex flex-col">
        <label for="artist-name">Name</label>
        <input
          type="text"
          id="artist-name"
          name="artist-name"
          class="bg-gray-300 mb-4"
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
          onClick={(e) => handleSubmit(e)}
          class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

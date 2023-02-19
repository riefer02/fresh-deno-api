import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { inputStyles } from "../lib/styles.ts";

type CreateAuthTokenProps = {
  apiURL: string;
  tokenExists: boolean;
  user: {} | undefined;
};

export default function CreateAuthToken({
  apiURL,
  tokenExists,
  user,
}: CreateAuthTokenProps) {
  const [apiToken, setAPIToken] = useState("");
  // const apiTokenRef = useRef<HTMLInputElement>();

  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const { message, token } = await fetch(`${apiURL}api/auth/create-token`, {
      method: "POST",
      body: JSON.stringify({ user }),
      credentials: "same-origin", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err.message));

    if (token) {
      // apiTokenRef.current.value = token;
      setAPIToken(token);
    }

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
      <h3 class="font-bold mb-2 underline">API Token</h3>
      <div className="flex flex-col w-full">
        <input
          name="api-token"
          type="text"
          label=""
          value={apiToken}
          placeholder={
            tokenExists
              ? "API token is hidden"
              : "Click to generate an API token"
          }
          readOnly
          class={`${inputStyles} pointer-events-none`}
        />
        <button
          onClick={(e) => formHandler(e)}
          type="submit"
          class="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
        >
          Create New Token
        </button>
      </div>
    </div>
  );
}

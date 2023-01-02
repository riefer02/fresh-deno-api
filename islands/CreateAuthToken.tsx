import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "preact/hooks";
import Input from "../components/form/Input.tsx";
import { UserContext } from "../routes/_app.tsx";

type CreateSongProps = {
  apiURL: string;
  tokenExists: boolean;
};

export default function CreateAuthToken({
  apiURL,
  tokenExists,
}: CreateSongProps) {
  const apiTokenRef = useRef<HTMLInputElement>();
  const user = useContext(UserContext);

  const [message, setMessage] = useState("");

  const formHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    setMessage("");

    const { message, token } = await fetch(`${apiURL}api/v1/generate-token`, {
      method: "POST",
      body: JSON.stringify({ user }),
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err.message));

    if (token && apiTokenRef.current) {
      apiTokenRef.current.value = token;
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
        {message && <div className="text-red-500">{message}</div>}
      </div>
      <h3 class="font-bold mb-2 underline">API Token</h3>
      <div className="flex flex-col w-full">
        {tokenExists ? (
          <Input
            name="api-token"
            type="text"
            label=""
            ref={apiTokenRef}
            placeholder={"API token is hidden"}
            readOnly={true}
          />
        ) : (
          <Input
            name="api-token"
            type="text"
            label=""
            ref={apiTokenRef}
            placeholder={"Click to generate an API token"}
            readOnly={true}
          />
        )}
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

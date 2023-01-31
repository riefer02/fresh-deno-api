import { useEffect, useRef, useState } from "preact/hooks";
import { Howl } from "https://esm.sh/howler@2.2.3";

type AudioPlayerProps = {
  apiURL: string;
};

function AudioPlayer({ apiURL }: AudioPlayerProps) {
  const ref = useRef(null);
  const [audioURL, setAudioURL] = useState("");

  const fetchAudio = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "audio/mpeg");

    const res = await fetch(`${apiURL}api/audio`, { headers })
      .then((res) => {
        console.log({ res });
        return res.body;
      })
      .then((rb) => {
        const reader = rb.getReader();
        console.log({ rb });

        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                console.log({ value });
                if (done) {
                  console.log("done", done);
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                console.log(done, value);
                push();
              });
            }
            push();
          },
        });
      })
      .then((stream) => {
        console.log({ stream });
        return new Response(stream, {
          headers: { "Content-Type": "audio/mpeg" },
        });
      })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => {
        console.log(url);
        ref.current.src = url;
        setAudioURL(url);
        // console.log({ lame });
        // ref.current.play();
      });
  };

  useEffect(() => {
    if (ref.current && ref.current.src !== false && audioURL) {
      ref.current.addEventListener("loadstart", () => {
        console.log("loadstart");
      });
    }

    return () => ref.current.removeEventListener("loadstart", null);
  }, [ref.current]);

  useEffect(() => {
    if (!audioURL) return;
    const sound = new Howl({
      src: [audioURL],
      html5: true,
    });

    // sound.play();
  }, [audioURL]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-4 gap-10">
      <button
        className="px-2 rounded-lg text-gray-600 bg-gray-100 border-purple-200 border"
        onClick={fetchAudio}
      >
        Fetch Audio
      </button>
      <audio ref={ref} controls />
    </div>
  );
}

export default AudioPlayer;

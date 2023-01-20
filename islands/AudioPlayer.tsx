import { useEffect, useRef } from "preact/hooks";

type AudioPlayerProps = {
  apiURL: string;
};

function AudioPlayer({ apiURL }: AudioPlayerProps) {
  const ref = useRef(null);

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
        ref.current.play();
      });
  };

  useEffect(() => {
    if (ref.current && ref.current.src !== false) {
      //   ref.current.add
    }
  }, [ref.current]);

  return (
    <div>
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

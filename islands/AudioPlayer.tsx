import { useEffect, useRef, useState } from "preact/hooks";
// import { Howl } from "https://esm.sh/howler@2.2.3";

type AudioPlayerProps = {
  apiURL: string;
};

function AudioPlayer({ apiURL }: AudioPlayerProps) {
  const ref = useRef(null);
  // const [audioURL, setAudioURL] = useState("");

  const fetchAudio = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "audio/ogg");

    const res = await fetch(`${apiURL}api/audio`, { headers });
    console.log({ res });

    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/ogg" });
    const url = URL.createObjectURL(blob);
    console.log(url);
  
    ref.current.src = url;
    // setAudioURL(url);
  };

  // useEffect(() => {
  //   if (!audioURL) return;
  //   const sound = new Howl({
  //     src: [audioURL],
  //     format: "ogg",
  //     html5: true,
  //   });
  
  //   sound.once('load', () => {
  //     console.log('howl')
  //     sound.play();
  //   });
  
  //   return () => {
  //     sound.unload();
  //   };
  // }, [audioURL]);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("canplaythrough", () => {
        ref.current.play();
      });
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("canplaythrough", () => {
          ref.current.play();
        });
      }
    };
  }, []);

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

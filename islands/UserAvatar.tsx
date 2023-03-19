import { useState } from "preact/hooks";

interface UserAvatarProps {
  src: string;
}

export default function UserAvatar({ src }: UserAvatarProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden relative">
      <div
        className={`absolute inset-0 bg-gray-300 animate-pulse ${
          isImageLoaded ? "hidden" : ""
        }`}
      ></div>
      <img
        src={src}
        alt=""
        className={`object-cover ${isImageLoaded ? "" : "hidden"}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
}

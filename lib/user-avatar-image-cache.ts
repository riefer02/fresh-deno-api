import { getUserAvatarImg } from "./get-user-avatar.ts";

export const fetchUserAvatarImg = async (
  avatar_url: string,
  user: string,
): Promise<string> => {
  const expirationSecs = 6000;
  const now = new Date();
  const avatarExpirationTime = new Date(now.getTime() + expirationSecs * 1000); // 6000 seconds * 1000 milliseconds per second
  const avatarExpiration = localStorage.getItem(`${user}-avatar-expiration`);
  const avatarExpirationCheck = avatarExpiration
    ? new Date(avatarExpirationTime)
    : null;
  let userAvatarUrl: string | null = null;

  if (
    avatarExpirationCheck &&
    new Date(avatarExpirationCheck) > now &&
    localStorage.getItem(`${user}-avatar`)
  ) {
    console.log("CACHED IMAGE ACCESSIBLE");
    userAvatarUrl = localStorage.getItem(`${user}-avatar`);
    userAvatarUrl = userAvatarUrl
      ? (JSON.parse(userAvatarUrl) as string)
      : null;

    // Todo figure out jwt expiration and image presigned url expiration issue
  } else {
    console.log("REFETCHING AVATAR IMAGE");
    if (avatar_url) {
      userAvatarUrl = await getUserAvatarImg(avatar_url, expirationSecs);

      if (userAvatarUrl) {
        localStorage.setItem(`${user}-avatar`, JSON.stringify(userAvatarUrl));

        if (avatarExpirationTime) {
          localStorage.setItem(
            `${user}-avatar-expiration`,
            avatarExpirationTime.toISOString()
          );
        }
      }
    }
  }

  if (!userAvatarUrl) {
    throw new Error("Failed to fetch user avatar image.");
  }

  return userAvatarUrl;
};

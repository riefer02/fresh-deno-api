import { getUserAvatarImg } from "./get-user-avatar.ts";

export const fetchUserAvatarImg = async (
  avatar_url: string,
  user: string
): Promise<string> => {
  const expirationSecs = 6000;
  const now = new Date();
  const avatarExpirationTime = new Date(now.getTime() + expirationSecs * 1000); // 6000 * 1000 milliseconds per second
  const cachedExpiration = localStorage.getItem(`${user}-avatar-expiration`);
  const avatarExpirationCheck = cachedExpiration
    ? new Date(cachedExpiration)
    : null; // corrected line
  let userAvatarUrl: string | null = null;

  // console.log({
  //   avatarExpirationTime: Date.parse(avatarExpirationTime),
  //   avatarExpirationCheck: Date.parse(avatarExpirationCheck),
  //   cachedExpiration: Date.parse(cachedExpiration),
  // });
  // console.log(
  //   "Cached expiration is greater than right now:",
  //   new Date(avatarExpirationCheck) > now
  // );
  // console.log(
  //   "Cached expiration is past due:",
  //   new Date(cachedExpiration) > now
  // );
  // console.log("AvatarExpirationCheck should exist", !!avatarExpirationCheck);
  // console.log(
  //   "Cached avatar exists in storage:",
  //   localStorage.getItem(`${user}-avatar`)
  // );

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

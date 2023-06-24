import { getUserAvatarImg } from "./get-user-avatar.ts";
import prisma from "../../lib/prisma-client.ts";

const localStorageExists = typeof localStorage !== "undefined";

const fetchAvatarFromLocalStorage = (email) => {
  let avatarData = null;
  if (!localStorageExists) return avatarData;

  try {
    const avatarExpirationCheck = new Date(
      localStorage.getItem(`${email}-avatar-expiration`)
    );
    const now = new Date();
    if (
      avatarExpirationCheck &&
      new Date(avatarExpirationCheck) > now &&
      localStorage.getItem(`${email}-avatar`)
    ) {
      avatarData = JSON.parse(localStorage.getItem(`${email}-avatar`));
    }
  } catch (err) {
    console.warn(`Failed to fetch avatar from localStorage: ${err.message}`);
  }
  return avatarData;
};

const saveAvatarToLocalStorage = (email, avatar, expiration) => {
  if (!localStorageExists) return;

  try {
    localStorage.setItem(`${email}-avatar`, JSON.stringify(avatar));
    localStorage.setItem(
      `${email}-avatar-expiration`,
      expiration.toISOString()
    );
  } catch (err) {
    console.warn(`Failed to save avatar to localStorage: ${err.message}`);
  }
};

export const getUserProfile = async (user) => {
  try {
    const expirationSecs = 6000;
    const now = new Date();
    const avatarExpiration = new Date(now.getTime() + expirationSecs * 1000); // 6000 seconds * 1000 milliseconds per second

    const { avatar_url, jwt_token } = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });

    let userAvatarUrl = fetchAvatarFromLocalStorage(user.email);

    if (!userAvatarUrl && avatar_url) {
      console.log("Requesting New Profile Image");
      userAvatarUrl = await getUserAvatarImg(avatar_url, expirationSecs);

      if (userAvatarUrl) {
        saveAvatarToLocalStorage(user.email, userAvatarUrl, avatarExpiration);
      }
    } else {
      console.log("Accessing Cached Profile Image");
    }

    const tokenExists = jwt_token ? true : false;

    return { userAvatarUrl, tokenExists };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  }
};

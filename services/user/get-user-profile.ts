import { getUserAvatarImg } from "./get-user-avatar.ts";
import prisma from "../../lib/prisma-client.ts";

export const getUserProfile = async (user) => {
  try {
    let userAvatarUrl;
    const expirationSecs = 6000;
    const now = new Date();
    const avatarExpiration = new Date(now.getTime() + expirationSecs * 1000); // 6000 seconds * 1000 milliseconds per second

    const { avatar_url, jwt_token } = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });


    // fetch last avatar expiration time
    const avatarExpirationCheck = new Date(
      localStorage.getItem(`${user.email}-avatar-expiration`)
    );

    if (
      avatarExpirationCheck &&
      new Date(avatarExpirationCheck) > now &&
      localStorage.getItem(`${user.email}-avatar`)
    ) {
      console.log("CACHED IMAGE ACCESSIBLE");

      // avatar image is cached and has not expired
      userAvatarUrl = JSON.parse(localStorage.getItem(`${user.email}-avatar`));
    } else {
      console.log("REFETCHING AVATAR IMAGE");

      // fetch avatar image
      if (avatar_url) {
        userAvatarUrl = await getUserAvatarImg(avatar_url, expirationSecs);

        if (userAvatarUrl) {
          // save url to local storage
          localStorage.setItem(
            `${user.email}-avatar`,
            JSON.stringify(userAvatarUrl)
          );

          // save expiration time to local storage
          localStorage.setItem(
            `${user.email}-avatar-expiration`,
            avatarExpiration.toISOString()
          );
        }
      }
    }

    const tokenExists = jwt_token ? true : false;

    return { userAvatarUrl, tokenExists };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  }
};

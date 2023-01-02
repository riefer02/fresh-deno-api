import { getUserAvatarImg } from "./get-user-avatar.ts";
import prisma from "../../lib/prisma-client.ts";

export const getUserProfile = async (user) => {
  try {
    let userAvatarUrl;

    const { avatar_url, jwt_token } = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });

    if (avatar_url) userAvatarUrl = await getUserAvatarImg(avatar_url);

    const tokenExists = jwt_token ? true : false;

    return { userAvatarUrl, tokenExists };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  }
};

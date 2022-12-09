import { getUserAvatarImg } from "./get-user-avatar.ts";
import prisma from "../../utils/prisma-client.ts";

export const getUserProfile = async (user) => {
  try {
    let userAvatarUrl;

    const { avatar_url } = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });

    const startTime = performance.now();
    if (avatar_url) userAvatarUrl = await getUserAvatarImg(avatar_url);
    const endTime = performance.now();

    console.log(`Call to getUserAvatarImg took ${endTime - startTime} milliseconds`);

    return { userAvatarUrl };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  }
};

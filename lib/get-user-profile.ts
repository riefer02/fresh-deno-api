import prisma from "./prisma-client.ts";
import { fetchUserAvatarImg } from "./user-avatar-image-cache.ts";

interface UserJwt {
  sub: string;
  email: string;
  exp: number;
  iss: string;
}

interface UserProfile {
  userAvatarUrl: string;
  tokenExists: boolean;
}

export const getUserProfile = async (
  userJwt: UserJwt
): Promise<UserProfile | Error> => {
  // console.log({userJwt})

  try {
    const { avatar_url, jwt_token } = await prisma.users.findUnique({
      where: {
        email: userJwt.email,
      },
    });

    const userAvatarUrl = await fetchUserAvatarImg(avatar_url, userJwt.email);
    const tokenExists = jwt_token ? true : false;

    return { userAvatarUrl, tokenExists };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  }
};

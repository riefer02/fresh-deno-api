import { getUserAvatarImg } from "../utils/supabase-api.ts";
import dbPool from "../utils/database-pool.ts";

export const getUserProfile = async (user) => {
  const dbConn = await dbPool.connect();

  try {
    let userAvatarKey, userAvatarUrl;

    const results =
      await dbConn.queryObject`SELECT (avatar_url) FROM public.users WHERE email = ${user.email};`;

    if (results.rows[0]) {
      userAvatarKey = results.rows[0]?.avatar_url;
    }

    if (userAvatarKey) userAvatarUrl = await getUserAvatarImg(userAvatarKey);

    return { userAvatarUrl };
  } catch (err) {
    return new Error(
      `Something went wrong when getting user profile data: ${err.message}`
    );
  } finally {
    dbConn.release();
  }
};

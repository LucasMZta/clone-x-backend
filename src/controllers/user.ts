import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { checkIfFollows, findUserBySlug, follow, getUserFollowedCount, getUserFollowingCount, getUserTweetCount, unfollow, updateUserInfo } from "../services/user";
import { userTweetSchema } from "../schemas/user-tweet";
import { findTweetsByUser } from "../services/tweet";
import { updateUserSchema } from "../schemas/update-user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
   const { slug } = req.params;

   const user = await findUserBySlug(slug);

   if (!user) {
      res.json({ error: 'Usuário não encontrado!' });
      return;
   }

   const followingCount = await getUserFollowingCount(user.slug);
   const followersCount = await getUserFollowedCount(user.slug);
   const tweetCount = await getUserTweetCount(user.slug);

   res.json({ user, followingCount, followersCount, tweetCount })
}

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
   const { slug } = req.params;

   const safeData = userTweetSchema.safeParse(req.query);
   if (!safeData.success) {
      res.json({ error: safeData.error.flatten().fieldErrors });
      return;
   }

   let perPage = 2;
   let currentPage = safeData.data.page ?? 0;

   const tweets = await findTweetsByUser(slug, currentPage, perPage);


   res.json({ tweets, page: currentPage });
}

export const followUserToggle = async (req: ExtendedRequest, res: Response) => {
   const { slug } = req.params;

   const me = req.userSlug as string;

   const hasUserToBeFollowed = await findUserBySlug(slug);

   if (!hasUserToBeFollowed) {
      res.json({ error: 'Usuário não encontrado!' })
      return;
   }
   if (me === slug) {
      res.json({ error: 'Voce não pode seguir a si mesmo' });
      return;
   }

   const follows = await checkIfFollows(me, slug);

   if (!follows) {
      await follow(me, slug);
      res.json({ following: true })
   } else {
      await unfollow(me, slug);
      res.json({ following: false })
   }

}

export const updateUser = async (req: ExtendedRequest, res: Response) => {

   const safeData = updateUserSchema.safeParse(req.body);

   if (!safeData.success) {
      res.json({ error: safeData.error.flatten().fieldErrors });
      return;
   }

   const updatedUser = await updateUserInfo(req.userSlug as string, safeData.data)

   // res.json({ success: true });
   res.json({ user: updatedUser });
}
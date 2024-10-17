import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { checkIfTweetIsLikedByUser, createTweet, findAnswersFromTweet, findTweet, likeTweet, unlikeTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
   //validar os dados enviados
   const safeData = addTweetSchema.safeParse(req.body);
   if (!safeData.success) {
      res.json({ error: safeData.error.flatten().fieldErrors })
      return;
   }

   //verificar se é um tweet original ou uma resposta (se for resposta, tem que ver se existe o tweet original)
   if (safeData.data.answer) {
      const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
      if (!hasAnswerTweet) {
         res.json({ error: 'Tweet original inexistente' })
         return;
      }
   }
   //criar o tweet
   const newTweet = await createTweet(req.userSlug as string, safeData.data.body, safeData.data.answer ? parseInt(safeData.data.answer) : 0)

   //adicionar o hastag ao trend
   const hashtags = safeData.data.body.match(/#[\p{L}\p{N}_]+/gu);
   if (hashtags) {
      for (let hashtag of hashtags) {
         if (hashtag.length >= 2) {
            await addHashtag(hashtag);
         }
      }
   }

   res.json({ tweet: newTweet })
}

export const getTweet = async (req: ExtendedRequest, res: Response) => {
   const { id } = req.params;

   const tweet = await findTweet(parseInt(id));

   if (!tweet) {
      res.json({ error: 'Tweet não encontrado' })
      return;
   }

   res.json({ tweet })
}

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
   const { id } = req.params;

   const answers = await findAnswersFromTweet(parseInt(id));

   res.json({ answers })
}

export const likeTweetToggle = async (req: ExtendedRequest, res: Response) => {
   const { id } = req.params;

   const isLiked = await checkIfTweetIsLikedByUser(req.userSlug as string, parseInt(id));
   let liked = false;
   if (isLiked) {
      await unlikeTweet(req.userSlug as string, parseInt(id));
      liked = false;
   } else {
      await likeTweet(req.userSlug as string, parseInt(id));
      liked = true;
   }

   res.json({ liked })
}
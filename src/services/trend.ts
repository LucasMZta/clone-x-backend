import { prisma } from "../utils/prisma"

export const addHashtag = async (hashtag: string) => {
   //verifica se existe para ou adicionar ou criar uma nova #
   const hs = await prisma.trend.findFirst({
      where: { hashtag }
   });
   if (hs) {
      await prisma.trend.update({
         where: { id: hs.id },
         data: { counter: hs.counter + 1, updatedAt: new Date() }
      })
   } else {
      await prisma.trend.create({
         data: { hashtag }
      })
   }
}
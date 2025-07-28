import { prisma } from "./prisma"

type User = {
  googleId: string;
  email: string;
  name: string;
  image?: string;
};

export async function createUser(user: User) {
  return await prisma.user.upsert({
    where: { googleId: user.googleId },
    update: {},
    create: {
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      image: user.image,
    },
  });
}

export async function findUser(id:number)
{
    return await prisma.user.findUnique({
        where:{
            id : id
        }
    })
}
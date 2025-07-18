import { prisma } from "./prisma";

type User = {
    googleId : string,
    email : string,
    name: string,
    image?: string
}
export async function createUser(user: User){
    const existuser = await prisma.user.findUnique({
        where:{
            googleId: user.googleId
        }
    })
    if(existuser){
        return existuser
    }
    return await prisma.user.create({
        data:{
            googleId: user.googleId,
            email: user.email,
            name : user.name,
            image: user.image
        }
    })
}
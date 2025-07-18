import { Redirect } from "@/components/redirect";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid"; // make sure to install nanoid

export default async function Chat() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <Redirect to="/" />;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      chat: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) return <Redirect to="/" />;

  const latestChat = user.chat?.[0];

  if (latestChat?.link) {
    redirect(`/chat/${latestChat.link}`);
  }

  const newChat = await prisma.chat.create({
    data: {
      userId: user.id,
      link: nanoid(12),
      title: "New Chat", 
    },
  });

  redirect(`/chat/${newChat.link}`);
}

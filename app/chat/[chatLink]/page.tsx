import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatClient from "@/components/chat-client";

interface ChatPageProps {
  params: {
    chatLink: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return redirect("/");

  const chat = await prisma.chat.findUnique({
    where: { link: params.chatLink },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat || chat.userId !== user.id) return notFound();

  const typedMessages = chat.messages.map((msg) => ({
    id: msg.id,
    text: msg.text,
    type: msg.type as "user" | "ai",
    chartData: msg.chartData,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <ChatClient
      chatLink={params.chatLink}
      messages={typedMessages}
      chatTitle={chat.title} // optional if you added title
    />
  );
}

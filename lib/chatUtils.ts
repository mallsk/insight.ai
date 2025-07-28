import {prisma} from "./prisma";

export async function createChatMessage({
  chatLink,
  role,
  content,
}: {
  chatLink: string;
  role: "user" | "assistant";
  content: string;
}) {
  const chat = await prisma.chat.findUnique({ where: { chatLink } });
  if (!chat) throw new Error("Chat not found");

  await prisma.message.create({
    data: {
      chatId: chat.id,
      role,
      content,
    },
  });
}

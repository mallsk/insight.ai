import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import authOptions from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const chatid = url.pathname.split("/").pop();

  if (!chatid) {
    return NextResponse.json({ error: "Chat ID is missing in the request URL" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const chat = await prisma.chat.findFirst({
    where: {
      userId: user.id,
      chatLink: chatid,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found or access denied" }, { status: 403 });
  }

  return NextResponse.json({ messages: chat.messages });
}

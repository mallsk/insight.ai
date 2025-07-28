import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { chat: true },
  });

  if (user) {
    return NextResponse.json({ chats: user.chat });
  }

  return NextResponse.json({ chats: [] });
}

import authOptions from "@/lib/auth";
import { findUser } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUser(session.user.id);

  if (user) {
    return NextResponse.json({ user }, { status: 200 });
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,res:NextResponse)
{
    const session = await getServerSession(authOptions);
    if(!session)
    {
        return NextResponse.json({error: "Unauthorised"},{status:400})
    }
    if (session?.user) {
    return NextResponse.json({ user: session.user }, { status: 200 });
  }
}
import ChatClient from "@/components/chat-client";
import { Redirect } from "@/components/redirect";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export default async function Chat() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <Redirect to="/" />;
  }
  return <ChatClient />
}

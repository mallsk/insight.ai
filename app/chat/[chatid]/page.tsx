import { Redirect } from "@/components/redirect";
import authOptions from "@/lib/auth";
import ChatDashboard from "@/pages/ChatDasboard";
import { getServerSession } from "next-auth";

export default async function ChatHome(){
  const session = await getServerSession(authOptions)
  if(!session?.user)
  {
    return <Redirect to="/" />
  }
  return <ChatDashboard />
}
import { Redirect } from "@/components/redirect";
import authOptions from "@/lib/auth";
import Dashboard from "@/pages/Dashboard";
import { getServerSession } from "next-auth";

export default async function chat(){
    const session = await getServerSession(authOptions)
    // console.log(session?.user?.id)
    if(!session)
    {
        return <Redirect to="/" />
    }
    return <Dashboard />
}
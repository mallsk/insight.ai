import LandingPage from "@/components/LandingPage";
import { Redirect } from "@/components/redirect";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
    if (session?.user) {
      return <Redirect to="/chat" />;
    }
  return <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white">

    <LandingPage />
  </div>
}

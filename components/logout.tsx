"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function Logout() {
  return(
        <Button
        onClick={()=> signOut()}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
    )
}

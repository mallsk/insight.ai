"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Logout() {
  return(
        <Button
        onClick={()=> signOut()}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Log out
          </Button>
    )
}

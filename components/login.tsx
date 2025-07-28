"use client";

import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function Login(){
    return(
        <Button
        onClick={()=> signIn()}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Sign in
          </Button>
    )
}
"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config/env";

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onGameCreation() {
    try {
      const response = await fetch(`${API_URL}/game`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      router.push(`/game/${data.gameId}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function onGameJoin() {
    try {
      const gameId = inputRef.current?.value;
      if (!gameId) return;
      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-20 p-10 items-center w-full">
      <h1>Chinese Checkers</h1>
      <div className="flex flex-col gap-5 items-center">
        <Button onClick={onGameCreation}>Create game</Button>
        <div className="flex gap-2 items-center">
          <div className="h-[1px] bg-primary w-24" />
          <h2>or</h2>
          <div className="h-[1px] bg-primary w-24" />
        </div>
        <form onSubmit={onGameJoin} className="flex flex-col gap-1">
          <h3>Join room:</h3>
          <div className="flex gap-2">
            <Input ref={inputRef} placeholder="Game ID" name="gameId" />
            <Button type="submit">Join</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

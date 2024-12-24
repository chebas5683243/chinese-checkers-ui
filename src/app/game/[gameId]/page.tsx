"use client";

import { useParams } from "next/navigation";

import { Room } from "@/components/room/room";
import { useGameStatusEvents } from "@/hooks/room/use-game-status-events";
import { useJoinGameEvent } from "@/hooks/room/use-join-game-event";
import { useResetOnLeave } from "@/hooks/room/use-reset-on-leave";
import { useUserConnectionEvents } from "@/hooks/room/use-user-connection-events";

export default function GameRoom() {
  const { gameId } = useParams<{ gameId: string }>();

  useJoinGameEvent(gameId);
  useUserConnectionEvents();
  useGameStatusEvents();
  useResetOnLeave();

  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center w-full">
        <Room />
      </div>
    </div>
  );
}

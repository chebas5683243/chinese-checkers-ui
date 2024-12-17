"use client";

import { useParams } from "next/navigation";

import { useRoomNotifications } from "./use-room-interactions";
import { Room } from "@/components/room/room";

export default function GameRoom() {
  const { gameId } = useParams<{ gameId: string }>();

  const { messages } = useRoomNotifications(gameId);

  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center w-full">
        <Room gameId={gameId} />
      </div>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
    </div>
  );
}

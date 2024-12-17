"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Board } from "@/components/board/board";
import { socket } from "@/lib/socket-io";
import { getUUID } from "@/utils/random";

export default function GameRoom() {
  const { gameId } = useParams<{ gameId: string }>();
  const [messages, setMessages] = useState<{ id: string; content: string }[]>(
    [],
  );

  useEffect(() => {
    function onGameStarting() {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: "Game starting..." },
      ]);
    }

    function onGameStarted() {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: "Game started" },
      ]);
    }

    function onPlayerJoined(payload: { userId: string }) {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: `${payload.userId.slice(0, 6)} joined` },
      ]);
    }

    function onPlayerLeft(payload: { userId: string }) {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: `${payload.userId.slice(0, 6)} left` },
      ]);
    }

    socket.emit("joinGame", gameId, (response) => {
      if (response.status === "error") {
        setMessages([{ id: getUUID(), content: "Failed to join the room" }]);
        return;
      }

      setMessages([{ id: getUUID(), content: "You have joined the room" }]);
    });

    socket.on("gameStarted", onGameStarted);
    socket.on("gameStarting", onGameStarting);
    socket.on("playerJoined", onPlayerJoined);
    socket.on("playerLeft", onPlayerLeft);

    return () => {
      socket.emit("leaveGame", gameId);

      socket.off("gameStarted", onGameStarted);
      socket.off("gameStarting", onGameStarting);
      socket.off("playerJoined", onPlayerJoined);
      socket.off("playerLeft", onPlayerLeft);
    };
  }, [gameId]);

  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center w-full">
        <Board />
      </div>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
    </div>
  );
}

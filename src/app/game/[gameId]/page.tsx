"use client";

import { useParams } from "next/navigation";

import { Room } from "@/components/room/room";
import { useConnectedUsers } from "@/hooks/room/use-connected-users";
import { useGameStatusEvents } from "@/hooks/room/use-game-status-events";
import { useJoinGameEvent } from "@/hooks/room/use-join-game-event";
import { useResetOnLeave } from "@/hooks/room/use-reset-on-leave";
import { useUserConnectionEvents } from "@/hooks/room/use-user-connection-events";
import { useGame } from "@/hooks/use-game-store";

import { useShallow } from "zustand/react/shallow";

export default function GameRoom() {
  const { gameId } = useParams<{ gameId: string }>();

  const { messages } = useGame(
    useShallow((state) => ({
      messages: state.messages,
      gameConnections: state.gameConnections,
    })),
  );

  const connectedUsers = useConnectedUsers();

  useJoinGameEvent(gameId);
  useUserConnectionEvents();
  useGameStatusEvents();
  useResetOnLeave();

  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center w-full">
        <Room />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h2>Messages</h2>
          <div className="flex flex-col gap-2">
            {messages.map((message, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>{message.content}</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2>Players</h2>
          <div className="flex flex-col gap-2">
            {connectedUsers.map((userId) => (
              <div key={userId}>{userId.slice(0, 6)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

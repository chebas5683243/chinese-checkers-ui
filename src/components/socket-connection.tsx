"use client";

import { useEffect } from "react";

import { socket } from "@/lib/socket-io";

export function SocketConnection() {
  useEffect(() => {
    function onConnect() {
      console.log("Connected to server");
    }

    function onDisconnect() {
      console.log("Disconnected from server");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return null;
}

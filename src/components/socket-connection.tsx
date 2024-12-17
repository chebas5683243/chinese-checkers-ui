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

    function onConnectError(error: Error) {
      console.error("Connection error", error);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";

import { CreateGameModal } from "../modals/create-game-modal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CreateGameModal />;
}

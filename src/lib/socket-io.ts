import { SOCKET_URL } from "@/config/env";

import { io } from "socket.io-client";

export const socket = io(SOCKET_URL);

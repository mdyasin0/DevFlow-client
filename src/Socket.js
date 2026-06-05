import { io } from "socket.io-client";

export const socket = io("https://devflow-server-s7bh.onrender.com", {
  autoConnect: true,
});

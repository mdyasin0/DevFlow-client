import { io } from "socket.io-client";

export const socket = io("https://devflow-server-777f.onrender.com", {
  autoConnect: true,
});
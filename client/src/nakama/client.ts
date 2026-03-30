import { Client } from "@heroiclabs/nakama-js";

export const nakamaClient = new Client(
  "defaultkey",
  "localhost",  
  "7350", 
);
export const socket = nakamaClient.createSocket();


export interface RoomMessage {
  id: string;
  type: RoomMessageType;
  content: string;
}

export enum RoomMessageType {
  GENERAL = "GENERAL",
  CHAT = "CHAT",
  MOVE = "MOVE",
  RESULT = "RESULT",
  ERROR = "ERROR",
}

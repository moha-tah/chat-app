import type { Chat } from "./Chat";
import type { User } from "./User";

export interface Invitation {
  id: number;
  chat: Chat;
  user: User;
}

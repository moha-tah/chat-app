import type { Chat } from "./Chat";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  admin: boolean;
  avatarUrl?: string;
  invitations: unknown[];
  createdChats: Chat[];
}

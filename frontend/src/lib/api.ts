import type { Participant } from "@/types/Participant";
import { BACKEND_URL } from "./constants";

export const getChatParticipants = async (
  chatId: number
): Promise<Participant[]> => {
  const response = await fetch(`${BACKEND_URL}/chats/${chatId}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat participants");
  }
  return response.json();
};

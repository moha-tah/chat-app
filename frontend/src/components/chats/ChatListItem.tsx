import React from "react";
import type { Chat } from "../../types/Chat";

type ChatStatus = "À venir" | "Ouvert" | "Fermé";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: (chat: Chat) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  onSelect,
}) => {
  const getChatStatus = (chatDate: Date, duration: number): ChatStatus => {
    const now = new Date();
    const chatStart = new Date(chatDate);
    const chatEnd = new Date(chatStart.getTime() + duration * 60000); // duration in minutes

    if (now < chatStart) {
      return "À venir";
    }
    if (now >= chatStart && now <= chatEnd) {
      return "Ouvert";
    }
    return "Fermé";
  };

  const status = getChatStatus(chat.date, chat.duration);

  const getStatusColor = () => {
    if (status === "Ouvert") return "bg-green-500";
    if (status === "Fermé") return "bg-red-500";
    return "bg-gray-500"; // À venir
  };

  return (
    <div
      onClick={() => status === "Ouvert" && onSelect(chat)}
      className={`p-4 flex justify-between items-center ${
        status === "Ouvert"
          ? "cursor-pointer hover:bg-slate-600"
          : "cursor-not-allowed opacity-60"
      } ${isSelected && status === "Ouvert" ? "bg-slate-600" : ""}`}
    >
      <div className="mr-4 w-full">
        <p className="font-semibold text-slate-100">{chat.title}</p>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor()}`}
        >
          {status}
        </span>
        <p className="mt-2 text-sm text-slate-400 truncate">
          {chat.description}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;

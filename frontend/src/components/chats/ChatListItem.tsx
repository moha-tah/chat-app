import React from "react";
import type { Chat } from "../../types/Chat";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  isOpen: boolean;
  onSelect: (chat: Chat) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  isOpen,
  onSelect,
}) => {
  return (
    <div
      onClick={() => isOpen && onSelect(chat)}
      className={`p-4 flex justify-between items-center ${
        isOpen
          ? "cursor-pointer hover:bg-slate-600"
          : "cursor-not-allowed opacity-60"
      } ${isSelected && isOpen ? "bg-slate-600" : ""}`}
    >
      <div className="mr-4 w-full">
        <p className="font-semibold text-slate-100">{chat.title}</p>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
            isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOpen ? "Ouvert" : "Fermé"}
        </span>
        <p className="mt-2 text-sm text-slate-400 truncate">
          {chat.description}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;

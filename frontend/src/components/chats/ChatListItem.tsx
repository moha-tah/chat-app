import React from "react";
import type { Chat } from "../../types/Chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { User } from "@/types/User";

type ChatStatus = "À venir" | "Ouvert" | "Fermé";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: (chat: Chat) => void;
  currentUser: User;
  onEdit: (chat: Chat) => void;
  onDelete: (chatId: number) => void;
  onLeave: (chatId: number) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  onSelect,
  currentUser,
  onEdit,
  onDelete,
  onLeave,
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

  const isCreator = currentUser.id === chat.creator.id;

  return (
    <div
      onClick={() => status === "Ouvert" && onSelect(chat)}
      className={`p-4 flex justify-between items-center group ${
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-full hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-5 w-5 text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 border-slate-700 text-white"
        >
          {isCreator ? (
            <>
              <DropdownMenuItem onClick={() => onEdit(chat)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(chat.id)}
              >
                Supprimer
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onLeave(chat.id)}
            >
              Quitter le chat
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatListItem;

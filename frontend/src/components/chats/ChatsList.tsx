import React, { useMemo, useState } from "react";
import type { Chat } from "../../types/Chat";
import ChatListItem from "./ChatListItem";
import CreateChat, { type ChatData } from "./CreateChat";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import type { User } from "@/types/User";

interface ChatsListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: (
    chatData: Omit<ChatData, "creatorId"> & { creatorId: number }
  ) => void;
  currentUser: User;
  onEditChat: (chat: Chat) => void;
  onDeleteChat: (chatId: number) => void;
  onLeaveChat: (chatId: number) => void;
}

type ChatStatus = "open" | "upcoming" | "closed";

const getChatStatus = (chat: Chat): ChatStatus => {
  const now = new Date();
  const chatStart = new Date(chat.date);
  const chatEnd = new Date(chatStart.getTime() + chat.duration * 60000);

  if (now >= chatStart && now <= chatEnd) {
    return "open";
  }
  if (now < chatStart) {
    return "upcoming";
  }
  return "closed";
};

const statusOrder: Record<ChatStatus, number> = {
  open: 1,
  upcoming: 2,
  closed: 3,
};

const ChatsList: React.FC<ChatsListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onCreateChat,
  currentUser,
  onEditChat,
  onDeleteChat,
  onLeaveChat,
}) => {
  const [showClosedChats, setShowClosedChats] = useState(false);

  const sortedAndFilteredChats = useMemo(() => {
    return chats
      .map((chat) => ({ ...chat, status: getChatStatus(chat) }))
      .filter((chat) => showClosedChats || chat.status !== "closed")
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [chats, showClosedChats]);

  return (
    <div className="w-1/4 bg-slate-700/50 border-r border-slate-600 flex flex-col max-h-[calc(100vh-85px)]">
      <div className="p-4 border-b border-slate-600">
        <h1 className="text-xl font-semibold text-slate-100 mb-4">Mes chats</h1>
        <CreateChat onCreateChat={onCreateChat} />
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="show-closed-chats"
            checked={showClosedChats}
            onCheckedChange={setShowClosedChats}
          />
          <Label htmlFor="show-closed-chats" className="text-slate-300">
            Afficher les chats passés
          </Label>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {sortedAndFilteredChats.map((chat) => {
          return (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={onSelectChat}
              currentUser={currentUser}
              onEdit={onEditChat}
              onDelete={onDeleteChat}
              onLeave={onLeaveChat}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatsList;

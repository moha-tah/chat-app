import React from "react";
import type { Chat } from "../../types/Chat";
import ChatListItem from "./ChatListItem";
import CreateChat, { type ChatData } from "./CreateChat";

interface ChatsListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: (chatData: ChatData) => void;
}

const ChatsList: React.FC<ChatsListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onCreateChat,
}) => {
  return (
    <div className="w-1/4 bg-slate-700/50 border-r border-slate-600 flex flex-col">
      <div className="p-4 border-b border-slate-600">
        <h1 className="text-xl font-semibold text-slate-100 mb-4">Mes chats</h1>
        <CreateChat onCreateChat={onCreateChat} />
      </div>
      <div className="flex-grow overflow-y-auto">
        {chats.map((chat) => {
          return (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={onSelectChat}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatsList;

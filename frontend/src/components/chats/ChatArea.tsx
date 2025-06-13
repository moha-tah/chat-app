import React from "react";
import type { Chat } from "../../types/Chat";
import ChatHeader from "./ChatHeader";
import MessagesArea from "./MessagesArea";
import MessageInput from "./MessageInput";
import type { WebSocketMessage } from "@/hooks";

interface ChatAreaProps {
  selectedChat: Chat | null;
  messages: WebSocketMessage[];
  onSendMessage: (message: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  messages,
  onSendMessage,
}) => {
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col bg-slate-800">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-400">Choisissez un chat pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-800">
      <ChatHeader chat={selectedChat} />
      <MessagesArea messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;

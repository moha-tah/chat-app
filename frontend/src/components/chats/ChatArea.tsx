import React from "react";
import type { Chat } from "../../types/Chat";
import type { TempMessage } from "./types";
import ChatHeader from "./ChatHeader";
import MessagesArea from "./MessagesArea";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  selectedChat: Chat | null;
  messages: TempMessage[];
  currentMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  messages,
  currentMessage,
  onMessageChange,
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
      <MessageInput
        currentMessage={currentMessage}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatArea;

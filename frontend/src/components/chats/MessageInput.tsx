import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Chat } from "@/types/Chat";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  chat: Chat | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, chat }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const getIsChatClosed = (chat: Chat | null): boolean => {
    if (!chat) return false;
    const now = new Date();
    const chatStart = new Date(chat.date);
    const chatEnd = new Date(chatStart.getTime() + chat.duration * 60 * 1000);
    return now > chatEnd;
  };

  const isChatClosed = getIsChatClosed(chat);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isChatClosed) return;
    if (currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage("");
    }
  };

  if (isChatClosed) {
    return (
      <div className="p-4 border-t border-slate-600 bg-slate-700/50">
        <div className="flex items-center">
          <div className="flex-grow p-2 pl-4 bg-slate-600 rounded-full text-center text-slate-400 border border-red-500">
            Le chat est fermé
          </div>
          <Button
            type="button"
            className="ml-2 p-2 rounded-full bg-red-500 cursor-not-allowed"
            disabled
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-slate-600 bg-slate-700/50">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Ton message..."
          className={cn(
            "flex-grow p-2 pl-4 bg-slate-600 rounded-full focus:outline-none text-slate-100 placeholder-slate-400",
            isChatClosed && "border border-red-500 cursor-not-allowed"
          )}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={isChatClosed}
        />
        <Button
          type="submit"
          className={cn(
            "ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700",
            isChatClosed && "bg-red-500 hover:bg-red-500 cursor-not-allowed"
          )}
          disabled={!currentMessage.trim() || isChatClosed}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;

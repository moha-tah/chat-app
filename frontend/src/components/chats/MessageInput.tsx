import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage("");
    }
  };

  return (
    <div className="p-4 border-t border-slate-600 bg-slate-700/50">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Ton message..."
          className="flex-grow p-2 pl-4 bg-slate-600 rounded-full focus:outline-none text-slate-100 placeholder-slate-400"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button
          type="submit"
          className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700"
          disabled={!currentMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;

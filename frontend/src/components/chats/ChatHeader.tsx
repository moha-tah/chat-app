import React, { useState } from "react";
import type { Chat } from "../../types/Chat";
import { Info } from "lucide-react";
import ChatInfoModal from "./ChatInfoModal";

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const remainingMinutes = Math.max(
    0,
    chat.duration -
      Math.floor((Date.now() - new Date(chat.date).getTime()) / (1000 * 60))
  );

  return (
    <>
      <div className="p-4 border-b border-slate-600 bg-slate-700/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{chat.title}</h2>
          <p className="text-sm text-slate-400">{chat.description}</p>
          <p className="text-sm text-slate-400">
            {`${new Date(chat.date).toLocaleDateString()} - ${
              chat.duration
            } minutes - ${remainingMinutes} minutes restantes`}
          </p>
        </div>
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="p-1 rounded-full hover:bg-slate-700"
        >
          <Info className="h-5 w-5 text-slate-400" />
        </button>
      </div>
      <ChatInfoModal
        chat={chat}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </>
  );
};

export default ChatHeader;

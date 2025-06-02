import React from "react";
import type { Chat } from "../../types/Chat";

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const remainingMinutes = Math.max(
    0,
    chat.duration -
      Math.floor((Date.now() - new Date(chat.date).getTime()) / (1000 * 60))
  );

  return (
    <div className="p-4 border-b border-slate-600 bg-slate-700/50">
      <h2 className="text-lg font-semibold text-slate-100">{chat.title}</h2>
      <p className="text-sm text-slate-400">{chat.description}</p>
      <p className="text-sm text-slate-400">
        {`${new Date(chat.date).toLocaleDateString()} - ${
          chat.duration
        } minutes - ${remainingMinutes} minutes restantes`}
      </p>
    </div>
  );
};

export default ChatHeader;

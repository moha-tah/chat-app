import React from "react";
import type { TempMessage } from "./types";

interface MessageItemProps {
  message: TempMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-transparent mr-3 flex-shrink-0"></div>
      <div>
        <p className="font-semibold text-sm text-slate-300">{message.sender}</p>
        <div className="bg-slate-700 p-2 rounded-lg mt-1">
          <p className="text-slate-100">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

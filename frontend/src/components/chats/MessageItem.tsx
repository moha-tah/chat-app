import React, { useEffect, useState } from "react";
import type { WebSocketMessage } from "@/hooks";
import type { User } from "@/types/User";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: WebSocketMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isCurrentUser = message.userId === currentUser?.id;

  if (
    message.type === "USER_JOIN" ||
    message.type === "USER_LEAVE" ||
    message.type === "ERROR"
  ) {
    return (
      <div className="text-center my-2">
        <p className="text-xs text-slate-400 italic">{message.message}</p>
      </div>
    );
  }

  if (message.type === "CHAT_MESSAGE") {
    return (
      <div
        className={cn("flex items-start", isCurrentUser ? "justify-end" : "")}
      >
        {!isCurrentUser && (
          <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-transparent mr-3 flex-shrink-0"></div>
        )}
        <div
          className={cn(
            "max-w-xs md:max-w-md",
            isCurrentUser ? "text-right" : ""
          )}
        >
          {!isCurrentUser && (
            <p className="font-semibold text-sm text-slate-300">
              Utilisateur {message.userId}
            </p>
          )}
          <div
            className={cn(
              "p-2 rounded-lg mt-1 inline-block",
              isCurrentUser ? "bg-blue-600" : "bg-slate-700"
            )}
          >
            <p className="text-slate-100">{message.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MessageItem;

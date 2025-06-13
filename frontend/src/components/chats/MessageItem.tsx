import React, { useEffect, useState } from "react";
import type { WebSocketMessage } from "@/hooks";
import type { User } from "@/types/User";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";

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
        {!isCurrentUser &&
          (message.avatarUrl ? (
            <img
              src={`${BACKEND_URL}${message.avatarUrl}`}
              alt={`Avatar de ${message.username}`}
              className="w-8 h-8 rounded-full border-2 border-slate-500 mr-3 flex-shrink-0 object-cover mt-7"
            />
          ) : (
            <UserIcon className="w-8 h-8 mr-3 mt-7" />
          ))}
        <div
          className={cn(
            "max-w-xs md:max-w-md",
            isCurrentUser ? "text-right" : ""
          )}
        >
          {!isCurrentUser && (
            <p className="font-semibold text-sm text-slate-300">
              {message.username}
            </p>
          )}
          <div
            className={cn(
              "p-2 rounded-lg mt-1 inline-block",
              isCurrentUser ? "bg-blue-600" : "bg-slate-700"
            )}
          >
            <p className="text-slate-100">{message.message}</p>
            {message.date && (
              <p
                className={cn(
                  "text-xs mt-1 text-right",
                  isCurrentUser ? "text-blue-200" : "text-slate-400"
                )}
              >
                {new Date(message.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MessageItem;

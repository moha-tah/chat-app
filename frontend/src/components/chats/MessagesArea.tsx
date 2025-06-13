import React, { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import type { WebSocketMessage } from "@/hooks";

interface MessagesAreaProps {
  messages: WebSocketMessage[];
}

const MessagesArea: React.FC<MessagesAreaProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-255px)]">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;

import React, { useState } from "react";
import Header from "../components/shared/Header";
import type { Chat } from "../types/Chat";
import { ChatsList, ChatArea, type TempMessage } from "../components/chats";

const ChatsPage: React.FC = () => {
  const mockInitialChats: Chat[] = [
    {
      id: 1,
      title: "Groupe SR03",
      description: "Discussion sur le projet de fin d'année",
      date: new Date(),
      duration: 30,
      invitations: [],
    },
  ];

  const initialMessages: TempMessage[] = [
    { id: "m1", sender: "Ismat", text: "Salut !" },
    {
      id: "m2",
      sender: "Mohamed",
      text: "Saaluttt !!!",
    },
    { id: "m3", sender: "Mohamed", text: "😄" },
    {
      id: "m4",
      sender: "Ismat",
      text: "Ça va ?",
    },
    { id: "m5", sender: "Mohamed", text: "Ouais et toi ?" },
    { id: "m6", sender: "Ismat", text: "Nickel !!!" },
  ];

  const [chats, _setChats] = useState<Chat[]>(mockInitialChats);
  const [messages, setMessages] = useState<TempMessage[]>(initialMessages);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Chat | null>(
    null
  );
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const isChatOpen = (chat: Chat): boolean => {
    const now = Date.now();
    const chatStartTime = new Date(chat.date).getTime();
    const minutesPassed = (now - chatStartTime) / (1000 * 60);
    return minutesPassed < chat.duration;
  };

  const handleSelectDiscussion = (discussion: Chat) => {
    setSelectedDiscussion(discussion);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    const newMessage: TempMessage = {
      id: `m${Date.now()}`,
      sender: "Mohamed",
      text: currentMessage.trim(),
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage("");
  };

  const handleMessageChange = (message: string) => {
    setCurrentMessage(message);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-800 text-white">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ChatsList
          chats={chats}
          selectedChat={selectedDiscussion}
          onSelectChat={handleSelectDiscussion}
          isChatOpen={isChatOpen}
        />
        <ChatArea
          selectedChat={selectedDiscussion}
          messages={messages}
          currentMessage={currentMessage}
          onMessageChange={handleMessageChange}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatsPage;

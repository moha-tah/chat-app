import React, { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import type { Chat } from "../types/Chat";
import { ChatsList, ChatArea, type TempMessage } from "../components/chats";
import type { ChatData } from "@/components/chats/CreateChat";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constants";

const ChatsPage: React.FC = () => {
  const mockInitialMessages: TempMessage[] = [
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

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<TempMessage[]>(mockInitialMessages);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch(`${BACKEND_URL}/chats`); // TODO:Fetch only my chats

      if (!response.ok) {
        toast.error(
          "Erreur pour récupérer les chats : " + (await response.text())
        );
        return;
      }

      const data = await response.json();
      setChats(data);
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleCreateChat = async (chatData: ChatData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        toast.error("Erreur pour créer le chat : " + (await response.text()));
        return;
      }

      const newChat: Chat = await response.json();

      setChats((prevChats) => [...prevChats, newChat]);
    } catch (error) {
      toast.error("Erreur pour créer le chat : " + error);
    }
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
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
        />
        <ChatArea
          selectedChat={selectedChat}
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

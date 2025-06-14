import React, { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import type { Chat } from "../types/Chat";
import { ChatsList, ChatArea } from "../components/chats";
import type { ChatData } from "@/components/chats/CreateChat";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constants";
import { useWebSocket } from "@/hooks";

const ChatsPage: React.FC = () => {
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      toast.error("Veuillez vous connecter pour accéder aux chats.");
      return;
    }
  }, []);

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { messages, setMessages, sendMessage } = useWebSocket(
    selectedChat?.id ?? null
  );

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch(`${BACKEND_URL}/chats`); // TODO: Fetch only my chats

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
    setMessages([]);
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
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatsPage;

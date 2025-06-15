import React, { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import type { Chat } from "../types/Chat";
import { ChatsList, ChatArea } from "../components/chats";
import type { ChatData } from "@/components/chats/CreateChat";
import EditChat, { type UpdateChatData } from "@/components/chats/EditChat";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constants";
import { useWebSocket } from "@/hooks";
import type { User } from "@/types/User";

const ChatsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      toast.error("Veuillez vous connecter pour accéder aux chats.");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
  }, []);

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { messages, setMessages, sendMessage } = useWebSocket(
      selectedChat?.id ?? null
  );

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser) return;
      const response = await fetch(
          `${BACKEND_URL}/users/${currentUser.id}/chats`
      );

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
  }, [currentUser]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const handleCreateChat = async (
      chatData: Omit<ChatData, "creatorId"> & { creatorId: number }
  ) => {
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
      toast.success(`Le chat "${newChat.title}" a été créé.`);
    } catch (error) {
      toast.error("Erreur pour créer le chat : " + error);
    }
  };

  const handleEditChat = (chat: Chat) => {
    setEditingChat(chat);
    setIsEditModalOpen(true);
  };

  const handleUpdateChat = async (chatId: number, chatData: UpdateChatData) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${BACKEND_URL}/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(currentUser.id),
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        toast.error(
            "Erreur pour mettre à jour le chat : " + (await response.text())
        );
        return;
      }

      const updatedChat = await response.json();
      setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? updatedChat : chat))
      );
      if (selectedChat?.id === chatId) {
        setSelectedChat(updatedChat);
      }
      toast.success("Le chat a été mis à jour.");
    } catch (error) {
      toast.error("Erreur pour mettre à jour le chat : " + error);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!currentUser) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce chat ?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": String(currentUser.id),
        },
      });

      if (!response.ok) {
        toast.error(
            "Erreur pour supprimer le chat : " + (await response.text())
        );
        return;
      }

      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
      toast.success("Le chat a été supprimé.");
    } catch (error) {
      toast.error("Erreur pour supprimer le chat : " + error);
    }
  };

  const handleLeaveChat = async (chatId: number) => {
    if (!currentUser) return;
    if (!window.confirm("Êtes-vous sûr de vouloir quitter ce chat ?")) return;

    try {
      const response = await fetch(
          `${BACKEND_URL}/chats/${chatId}/users/${currentUser.id}/leave`,
          {
            method: "POST",
            headers: {
              "X-User-Id": String(currentUser.id),
            },
          }
      );

      if (!response.ok) {
        toast.error("Erreur pour quitter le chat : " + (await response.text()));
        return;
      }

      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
      toast.success("Vous avez quitté le chat.");
    } catch (error) {
      toast.error("Erreur pour quitter le chat : " + error);
    }
  };

  if (!currentUser) {
    return null;
  }


    return (
        <div className="flex flex-col min-h-screen bg-slate-800 text-white relative">
            <Header />

            {!currentUser?.active && (
                <>
                    <div className="absolute top-[64px] left-0 w-full h-[calc(100%-64px)] backdrop-blur-sm bg-black/50 z-20" />

                    <div className="absolute top-[64px] left-0 w-full z-30 flex justify-center p-4">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md">
                            Votre compte est désactivé. Veuillez contacter un administrateur pour l'activer.
                        </div>
                    </div>
                </>
            )}

            <div className="flex flex-grow overflow-hidden z-10">
                <ChatsList
                    chats={chats}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                    onCreateChat={handleCreateChat}
                    currentUser={currentUser}
                    onEditChat={handleEditChat}
                    onDeleteChat={handleDeleteChat}
                    onLeaveChat={handleLeaveChat}
                />
                <ChatArea
                    selectedChat={selectedChat}
                    messages={messages}
                    onSendMessage={sendMessage}
                />
            </div>

            <EditChat
                chat={editingChat}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                onUpdateChat={handleUpdateChat}
            />
        </div>
    );

};

export default ChatsPage;
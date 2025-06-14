import { useState, useEffect, useRef } from "react";
import { WS_BACKEND_URL } from "@/lib/constants";
import { toast } from "sonner";
import type { User } from "@/types/User";

enum WebSocketMessageType {
  AUTH_REQUEST = "AUTH_REQUEST",
  AUTH_RESPONSE = "AUTH_RESPONSE",
  AUTH_SUCCESS = "AUTH_SUCCESS",
  AUTH_FAILURE = "AUTH_FAILURE",
  CHAT_MESSAGE = "CHAT_MESSAGE",
  USER_JOIN = "USER_JOIN",
  USER_LEAVE = "USER_LEAVE",
  ERROR = "ERROR",
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  message: string;
  userId?: number;
  username?: string;
  avatarUrl?: string;
  date?: Date;
  chatId?: number;
}

export const useWebSocket = (chatId: number | null) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}") as User;

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      toast.error("Utilisateur non authentifié.");
      return;
    }
    const user: User = JSON.parse(storedUser);
    const userId = user.id;

    const ws = new WebSocket(`${WS_BACKEND_URL}/channels/${chatId}`);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket connected for chat ${chatId}`);
    };

    ws.onmessage = (event) => {
      const receivedMessage: WebSocketMessage = JSON.parse(event.data);
      console.log("Received message:", receivedMessage);

      if (receivedMessage.type === "AUTH_REQUEST") {
        const authResponse = {
          type: "AUTH_RESPONSE",
          userId: userId,
        };
        ws.send(JSON.stringify(authResponse));
      } else if (receivedMessage.type === "AUTH_SUCCESS") {
        setIsConnected(true);
        toast.success("Connecté au chat !");
      } else if (receivedMessage.type === "AUTH_FAILURE") {
        toast.error(`Erreur d'authentification: ${receivedMessage.message}`);
        ws.close();
      } else {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected for chat ${chatId}`);
      setIsConnected(false);
      webSocketRef.current = null;
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Erreur de connexion WebSocket.");
      setIsConnected(false);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [chatId]);

  const sendMessage = (messageText: string) => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === WebSocket.OPEN
    ) {
      const messageToSend = {
        type: "CHAT_MESSAGE",
        message: messageText,
        userId: user.id,
        username: user.firstName + " " + user.lastName,
        avatarUrl: user.avatarUrl,
        date: new Date(),
        chatId: chatId,
      };
      webSocketRef.current.send(JSON.stringify(messageToSend));
    } else {
      toast.error("La connexion WebSocket n'est pas ouverte.");
    }
  };

  return { messages, isConnected, sendMessage, setMessages };
};

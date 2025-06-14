import React, { useEffect, useState } from "react";
import type { Chat } from "@/types/Chat";
import type { Participant } from "@/types/Participant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getChatParticipants } from "@/lib/api";
import { Crown } from "lucide-react";

interface ChatInfoModalProps {
  chat: Chat;
  isOpen: boolean;
  onClose: () => void;
}

const ChatInfoModal: React.FC<ChatInfoModalProps> = ({
  chat,
  isOpen,
  onClose,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (isOpen && chat.id) {
      getChatParticipants(chat.id)
        .then(setParticipants)
        .catch((error) =>
          console.error("Failed to fetch participants:", error)
        );
    }
  }, [isOpen, chat.id]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{chat.title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {chat.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Créé par :</span>{" "}
            {chat.creator.firstName} {chat.creator.lastName}
          </p>
          <p>
            <span className="font-semibold">Date de début :</span>
            {" Le "}
            {new Date(chat.date).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="font-semibold">Durée :</span> {chat.duration}{" "}
            minutes
          </p>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Participants :</span>
            <div className="flex flex-wrap">
              {participants.map((user: Participant) => (
                <Badge
                  key={user.id}
                  variant="secondary"
                  className={`mr-1 mb-1 flex items-center gap-1 ${
                    user.id === chat.creator.id ? "bg-amber-500 text-black" : ""
                  }`}
                >
                  {user.id === chat.creator.id && <Crown className="h-3 w-3" />}
                  {user.firstName} {user.lastName}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInfoModal;

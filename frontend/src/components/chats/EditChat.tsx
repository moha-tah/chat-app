import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SelectUsers from "./SelectUsers";
import type { Chat } from "@/types/Chat";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constants";
import type { User } from "@/types/User";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string(),
  duration: z.coerce
    .number({ message: "La durée est requise" })
    .min(5, "La durée doit être d'au moins 5 minutes")
    .max(1440, "La durée ne peut pas dépasser 1440 minutes (24 heures)"),
  invitedUserIds: z
    .array(z.number())
    .min(1, "Au moins un utilisateur doit être invité"),
});

type FormData = z.infer<typeof formSchema>;

export interface UpdateChatData {
  title: string;
  description: string;
  date: string;
  duration: number;
  invitedUserIds: number[];
}

interface EditChatProps {
  chat: Chat | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpdateChat: (chatId: number, chatData: UpdateChatData) => void;
}

const EditChat: React.FC<EditChatProps> = ({
  chat,
  isOpen,
  setIsOpen,
  onUpdateChat,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchInvitedUsers = async (chatId: number) => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/invitations/chats/${chatId}/users`
        );
        if (!response.ok) {
          toast.error("Erreur pour récupérer les invités");
          return;
        }
        const invitedUsers: User[] = await response.json();
        const invitedUserIds = invitedUsers.map((user) => user.id);
        form.setValue("invitedUserIds", invitedUserIds);
      } catch (error) {
        toast.error("Erreur pour récupérer les invités : " + error);
      }
    };

    if (chat) {
      form.reset({
        title: chat.title,
        description: chat.description,
        date: new Date(
          new Date(chat.date).getTime() -
            new Date(chat.date).getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),
        duration: chat.duration,
        invitedUserIds: [], // will be fetched
      });
      fetchInvitedUsers(chat.id);
    }
  }, [chat, form]);

  if (!chat) return null;

  const onSubmit = (data: FormData) => {
    onUpdateChat(chat.id, data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le chat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du chat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description du chat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date et heure</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={5} max={1440} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invitedUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilisateurs invités</FormLabel>
                  <FormControl>
                    <SelectUsers
                      selectedUserIds={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChat;

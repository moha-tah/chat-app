import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import type { User } from "@/types/User";
import SelectUsers from "./SelectUsers";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z
    .string()
    .refine((val) => new Date(val) >= new Date(Date.now() - 60 * 1000), {
      message: "La date ne peut pas être dans le passé",
    }),
  duration: z.coerce
    .number({ message: "La durée est requise" })
    .min(5, "La durée doit être d'au moins 5 minutes")
    .max(1440, "La durée ne peut pas dépasser 1440 minutes (24 heures)"),
  invitedUserIds: z
    .array(z.number())
    .min(1, "Au moins un utilisateur doit être invité"),
});

type FormData = z.infer<typeof formSchema>;

export interface ChatData {
  title: string;
  description: string;
  date: string;
  duration: number;
  invitedUserIds: number[];
}

interface CreateChatProps {
  onCreateChat: (
    chatData: Omit<ChatData, "creatorId"> & { creatorId: number }
  ) => void;
}

const CreateChat: React.FC<CreateChatProps> = ({ onCreateChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      duration: undefined,
      invitedUserIds: [],
    },
  });

  const onSubmit = (data: FormData) => {
    onCreateChat({ ...data, creatorId: user.id });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau chat</DialogTitle>
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
                      selectedUserIds={field.value}
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
                Créer le chat
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChat;

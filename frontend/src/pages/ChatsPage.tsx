import React, { useState } from "react";
import Header from "../components/shared/Header";
import type { Chat } from "../types/Chat";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface TempMessage {
  id: string;
  sender: string;
  text: string;
}

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
  ];

  const [discussions, _setDiscussions] = useState<Chat[]>(mockInitialChats);
  const [messages, _setMessages] = useState<TempMessage[]>(initialMessages);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Chat | null>(
    discussions[0] || null
  );

  const handleSelectDiscussion = (discussion: Chat) => {
    setSelectedDiscussion(discussion);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-800 text-white">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/4 bg-slate-700/50 border-r border-slate-600 flex flex-col">
          <div className="p-4 border-b border-slate-600">
            <h1 className="text-xl font-semibold text-slate-100">
              Discussions
            </h1>
          </div>
          <div className="flex-grow overflow-y-auto">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                onClick={() => handleSelectDiscussion(discussion)}
                className={`p-4 cursor-pointer hover:bg-slate-600 ${
                  selectedDiscussion && selectedDiscussion.id === discussion.id
                    ? "bg-slate-600"
                    : ""
                }`}
              >
                <p className="font-semibold text-slate-100">
                  {discussion.title}
                </p>
                <p className="text-sm text-slate-400 truncate">
                  {discussion.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-800">
          {selectedDiscussion ? (
            <>
              <div className="p-4 border-b border-slate-600 bg-slate-700/50">
                <h2 className="text-lg font-semibold text-slate-100">
                  {selectedDiscussion.title}
                </h2>
                <p className="text-sm text-slate-400">
                  {selectedDiscussion.description}
                </p>
                <p className="text-sm text-slate-400">
                  {`[${selectedDiscussion.date.toLocaleDateString()}] - ${
                    selectedDiscussion.duration
                  } minutes - ${
                    selectedDiscussion.duration -
                    Math.floor(
                      (Date.now() - selectedDiscussion.date.getTime()) /
                        (1000 * 60)
                    )
                  } minutes restantes`}
                </p>
              </div>

              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-transparent mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-sm text-slate-300">
                        {message.sender}
                      </p>
                      <div className="bg-slate-700 p-2 rounded-lg mt-1">
                        <p className="text-slate-100">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-600 bg-slate-700/50">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Ton message..."
                    className="flex-grow p-2 pl-4 bg-slate-600 rounded-full focus:outline-none text-slate-100 placeholder-slate-400"
                  />
                  <Button className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-slate-400">
                Choisissez un chat pour commencer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;

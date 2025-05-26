import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Plus, Settings, Send, Users, Calendar, Edit3, Trash2, UserPlus, LogOut, User } from 'lucide-react';
import './app.css';


// Types
interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
}

interface Chat {
    id: number;
    name: string;
    description: string;
    scheduledDate: string;
    isActive: boolean;
    createdBy: User;
    participants: User[];
}

interface Invitation {
    id: number;
    chat: Chat;
    invitedUser: User;
    sentBy: User;
    status: string;
}

interface Message {
    id: string;
    content: string;
    sender: User;
    timestamp: Date;
    chatId: number;
}

// API Base URL - adjust this to your backend URL
const API_BASE_URL = 'http://localhost:8080';

// API Service
class ApiService {
    static async request(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // User APIs
    static async login(email: string, password: string): Promise<User> {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    static async getAllUsers(): Promise<User[]> {
        return this.request('/users');
    }

    static async createUser(userData: any): Promise<User> {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Chat APIs
    static async getAllChats(): Promise<Chat[]> {
        return this.request('/chats');
    }

    static async createChat(chatData: any): Promise<Chat> {
        return this.request('/chats', {
            method: 'POST',
            body: JSON.stringify(chatData),
        });
    }

    static async updateChat(id: number, chatData: any): Promise<Chat> {
        return this.request(`/chats/${id}`, {
            method: 'PUT',
            body: JSON.stringify(chatData),
        });
    }

    static async deleteChat(id: number): Promise<void> {
        return this.request(`/chats/${id}`, {
            method: 'DELETE',
        });
    }

    // Invitation APIs
    static async getAllInvitations(): Promise<Invitation[]> {
        return this.request('/invitations');
    }

    static async createInvitation(invitationData: any): Promise<Invitation> {
        return this.request('/invitations', {
            method: 'POST',
            body: JSON.stringify(invitationData),
        });
    }

    static async getInvitationsByUserId(userId: number): Promise<Invitation[]> {
        return this.request(`/invitations/users/${userId}`);
    }
}

// WebSocket Service
class WebSocketService {
    private ws: WebSocket | null = null;
    private messageHandlers: ((message: Message) => void)[] = [];

    connect(chatId: number, userId: number) {
        // Adjust WebSocket URL to your backend
        this.ws = new WebSocket(`ws://localhost:8080/chat/${chatId}?userId=${userId}`);

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(message));
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    sendMessage(content: string, chatId: number, sender: User) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = {
                content,
                chatId,
                sender,
                timestamp: new Date(),
            };
            this.ws.send(JSON.stringify(message));
        }
    }

    onMessage(handler: (message: Message) => void) {
        this.messageHandlers.push(handler);
    }

    removeMessageHandler(handler: (message: Message) => void) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }
}

const wsService = new WebSocketService();

// Components
const LoginForm: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const user = await ApiService.login(email, password);
            onLogin(user);
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-blue-600" />
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">Chat App</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatList: React.FC<{
    chats: Chat[];
    onSelectChat: (chat: Chat) => void;
    onCreateChat: () => void;
    onEditChat: (chat: Chat) => void;
    onDeleteChat: (chatId: number) => void;
    selectedChatId?: number;
}> = ({ chats, onSelectChat, onCreateChat, onEditChat, onDeleteChat, selectedChatId }) => {
    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Chat Rooms</h2>
                    <button
                        onClick={onCreateChat}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedChatId === chat.id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
                        }`}
                        onClick={() => onSelectChat(chat)}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{chat.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{chat.description}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(chat.scheduledDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Users className="h-3 w-3 mr-1" />
                                    {chat.participants?.length || 0} participants
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditChat(chat);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChatRoom: React.FC<{
    chat: Chat;
    currentUser: User;
    messages: Message[];
    onSendMessage: (content: string) => void;
}> = ({ chat, currentUser, messages, onSendMessage }) => {
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim()) {
            onSendMessage(messageInput.trim());
            setMessageInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
                <p className="text-sm text-gray-600">{chat.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {chat.participants?.length || 0} participants
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender.id === currentUser.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-900'
                            }`}
                        >
                            <div className="text-xs mb-1 opacity-75">
                                {message.sender.firstName} {message.sender.lastName}
                            </div>
                            <div>{message.content}</div>
                            <div className="text-xs mt-1 opacity-75">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

const ChatFormModal: React.FC<{
    chat?: Chat;
    onSave: (chatData: any) => void;
    onClose: () => void;
    users: User[];
}> = ({ chat, onSave, onClose, users }) => {
    const [name, setName] = useState(chat?.name || '');
    const [description, setDescription] = useState(chat?.description || '');
    const [scheduledDate, setScheduledDate] = useState(
        chat?.scheduledDate ? new Date(chat.scheduledDate).toISOString().slice(0, 16) : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            description,
            scheduledDate: new Date(scheduledDate).toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {chat ? 'Edit Chat Room' : 'Create Chat Room'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scheduled Date
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {chat ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main App Component
const ChatApp: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showChatModal, setShowChatModal] = useState(false);
    const [editingChat, setEditingChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadChats();
            loadUsers();
        }
    }, [currentUser]);

    useEffect(() => {
        if (selectedChat && currentUser) {
            // Connect to WebSocket for the selected chat
            wsService.connect(selectedChat.id, currentUser.id);

            const messageHandler = (message: Message) => {
                setMessages(prev => [...prev, message]);
            };

            wsService.onMessage(messageHandler);

            return () => {
                wsService.removeMessageHandler(messageHandler);
                wsService.disconnect();
            };
        }
    }, [selectedChat, currentUser]);

    const loadChats = async () => {
        try {
            const chatsData = await ApiService.getAllChats();
            setChats(chatsData);
        } catch (error) {
            console.error('Failed to load chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await ApiService.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSelectedChat(null);
        setMessages([]);
        wsService.disconnect();
    };

    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        setMessages([]); // Reset messages when switching chats
    };

    const handleCreateChat = () => {
        setEditingChat(null);
        setShowChatModal(true);
    };

    const handleEditChat = (chat: Chat) => {
        setEditingChat(chat);
        setShowChatModal(true);
    };

    const handleSaveChat = async (chatData: any) => {
        try {
            if (editingChat) {
                const updatedChat = await ApiService.updateChat(editingChat.id, chatData);
                setChats(prev => prev.map(c => c.id === editingChat.id ? updatedChat : c));
                if (selectedChat?.id === editingChat.id) {
                    setSelectedChat(updatedChat);
                }
            } else {
                const newChat = await ApiService.createChat(chatData);
                setChats(prev => [...prev, newChat]);
            }
            setShowChatModal(false);
            setEditingChat(null);
        } catch (error) {
            console.error('Failed to save chat:', error);
        }
    };

    const handleDeleteChat = async (chatId: number) => {
        if (confirm('Are you sure you want to delete this chat?')) {
            try {
                await ApiService.deleteChat(chatId);
                setChats(prev => prev.filter(c => c.id !== chatId));
                if (selectedChat?.id === chatId) {
                    setSelectedChat(null);
                }
            } catch (error) {
                console.error('Failed to delete chat:', error);
            }
        }
    };

    const handleSendMessage = (content: string) => {
        if (selectedChat && currentUser) {
            wsService.sendMessage(content, selectedChat.id, currentUser);
        }
    };

    if (!currentUser) {
        return <LoginForm onLogin={handleLogin} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Chat App</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{currentUser.firstName} {currentUser.lastName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <ChatList
                    chats={chats}
                    onSelectChat={handleSelectChat}
                    onCreateChat={handleCreateChat}
                    onEditChat={handleEditChat}
                    onDeleteChat={handleDeleteChat}
                    selectedChatId={selectedChat?.id}
                />

                {selectedChat ? (
                    <ChatRoom
                        chat={selectedChat}
                        currentUser={currentUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageCircle className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Select a chat room
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Choose a chat room from the sidebar to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Modal */}
            {showChatModal && (
                <ChatFormModal
                    chat={editingChat}
                    onSave={handleSaveChat}
                    onClose={() => {
                        setShowChatModal(false);
                        setEditingChat(null);
                    }}
                    users={users}
                />
            )}
        </div>
    );
};

export default ChatApp;
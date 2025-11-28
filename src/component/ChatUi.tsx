import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from 'react';
import { fetchUsers, getMessages, sendMessage } from "../api/api";
import type { Message, User } from "../types";

interface ChatUiProps {
  currentUser: User;
  onLogout: () => void; 
}

const ChatUi: React.FC<ChatUiProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load users
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      // Exclude current user from the list
      setUsers(data.filter((u: User) => u._id !== currentUser._id));
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  // Load messages
  const loadMessages = async (userId: string) => {
    try {
      const data = await getMessages(currentUser._id, userId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Initial load users
  useEffect(() => {
    loadUsers();
  }, [currentUser]);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser) loadMessages(selectedUser._id);
  }, [selectedUser]);

  // Auto-fetch messages every 3s
  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      loadMessages(selectedUser._id);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const msg = await sendMessage(currentUser._id, selectedUser._id, newMessage);
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sm:w-64 w-[120px] bg-white border-r border-gray-300 flex flex-col">
        {/* Header with logout */}
        <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-300">
          <h2 className="sm:text-xl font-bold text-sm mb-2 sm:mb-0">Online Users</h2>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-2 sm:px-3 sm:py-1 py-0.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Show logged-in user at top */}
        <ul className="flex-col">
          <li className="sm:p-4 px-1 py-1 bg-gray-100 flex justify-between items-center font-semibold border-b border-gray-300">
            <span>{currentUser.name} (You)</span>
            {currentUser.online && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
          </li>
        </ul>

        {/* List of other users */}
        <ul className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user._id}
              className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <span>{user.name}</span>
              {user.online && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col sticky top-0">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-300 font-bold">
              Chat with {selectedUser.name}
            </div>

            {/* Messages */}
            <div className=" overflow-y-auto">
              <div className="flex-1 p-4 space-y-2 h-[calc(100vh-132px)]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md max-w-[100px] ${
                      msg.sender === currentUser._id
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-red-300"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white flex gap-2 border-t border-gray-300">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUi;

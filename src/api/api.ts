import axios from "axios";

const BASE_URL = "http://localhost:3000"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email: string, name?: string) => {
  const res = await api.post("/login", { email, name });
  return res.data;
};

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const sendMessage = async (sender: string, receiver: string, message: string) => {
  const res = await api.post("/send-message", { sender, receiver, message });
  return res.data;
};

export const getMessages = async (sender: string, receiver: string) => {
  const res = await api.get(`/messages?sender=${sender}&receiver=${receiver}`);
  return res.data;
};

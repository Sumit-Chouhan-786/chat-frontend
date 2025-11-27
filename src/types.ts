// src/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  online: boolean;
}

export interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt?: string;
}

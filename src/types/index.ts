
export interface Contact {
  id: string;
  name: string;
  age: number;
  intellectualDisability: string; // "DI" in Portuguese
  assistanceLevel: "low" | "medium" | "high";
  cid: string;
  stereotypies: string[];
  likes: string[];
  dislikes: string[];
  lastMessageTime?: Date;
  avatar?: string; // Base64 or URL of the avatar
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export interface Conversation {
  contactId: string;
  messages: Message[];
}


export interface Contact {
  id: string;
  name: string;
  age: number;
  intellectualDisability: string; // "DI" in Portuguese
  assistanceLevel: "leve" | "moderado" | "severo";
  cid: string;
  stereotypies: string[];
  likes: string[];
  dislikes: string[];
  medications?: Medication[];
  lastMessageTime?: Date;
  avatar?: string; // Base64 or URL of the avatar
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // Frequency in hours
  effects: string[];
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

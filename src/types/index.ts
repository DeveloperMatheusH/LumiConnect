
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
  
  // Novos campos para comunicação
  communication?: {
    verbalCommunication?: string; // Nivel de fluência verbal
    nonVerbalCommunication?: string; // Gestos, expressões, linguagem corporal
    symbolsUse?: string; // PEC's, pranchas de comunicação
  };
  
  // Novos campos para mobilidade
  mobility?: {
    locomotionCapacity?: string; // Independente, com auxílio, cadeira de rodas
    specificMotorDifficulties?: string; // Dificuldades motoras específicas
  };
  
  // Campo para outras necessidades específicas
  specificNeeds?: string; // Necessidades específicas que não se encaixam nas categorias
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
  mediaAttachments?: MediaAttachment[]; // Anexos de mídia
}

export interface MediaAttachment {
  id: string;
  type: "image" | "video" | "audio"; // Tipo de mídia
  url: string; // URL ou Base64 do arquivo
  name: string; // Nome do arquivo
  timestamp: Date; // Data de upload
}

export interface Conversation {
  contactId: string;
  messages: Message[];
}

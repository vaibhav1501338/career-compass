
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  stream: string;
  interests: string[];
  savedRoadmaps: string[];
  createdAt: Timestamp;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Timestamp;
}

export interface Career {
  id?: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
}

export interface Roadmap {
  id?: string;
  title: string;
  steps: { title: string; description: string; completed: boolean }[];
  duration: string;
  careerId: string;
}

export interface Resume {
    id?: string;
    userId: string;
    fileUrl: string;
    feedback: string;
    uploadedAt: Timestamp;
}

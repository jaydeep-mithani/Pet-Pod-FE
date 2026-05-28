export type PetSpecies = "DOG" | "CAT" | "RABBIT" | "BIRD" | "SMALL" | "OTHER";

export type PetSize = "SMALL" | "MEDIUM" | "LARGE";

export type PetStatus = "AVAILABLE" | "PENDING" | "ADOPTED";

export interface Photo {
  id: string;
  url: string;
  order: number;
}

export interface PetOwnerSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  createdAt: string;
}

export interface PetListItem {
  id: string;
  name: string | null;
  species: PetSpecies;
  breed: string | null;
  ageMonths: number;
  size: PetSize;
  shortDescription: string;
  city: string;
  region: string | null;
  country: string;
  status: PetStatus;
  createdAt: string;
  photos: Photo[];
}

export interface PetDetail extends PetListItem {
  story: string | null;
  reasonForRehoming: string | null;
  updatedAt: string;
  ownerId: string;
  owner: PetOwnerSummary;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  createdAt: string;
}

export interface AuthUserSummary {
  id: string;
  email: string;
  name: string;
}

export interface UserMini {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ConversationPetSummary {
  id: string;
  name: string | null;
  species: PetSpecies;
  status: PetStatus;
  photos: Photo[];
}

export interface Conversation {
  id: string;
  petId: string;
  ownerId: string;
  adopterId: string;
  createdAt: string;
  updatedAt: string;
  pet: ConversationPetSummary;
  owner: UserMini;
  adopter: UserMini;
}

export interface ConversationListItem extends Conversation {
  /** May contain up to 1 entry (the latest message). */
  messages: Array<{
    id: string;
    body: string;
    senderId: string;
    createdAt: string;
  }>;
  unreadCount: number;
}

export interface MessagesReadEvent {
  conversationId: string;
  readerId: string;
  messageIds: string[];
  readAt: string;
}

export interface MessagesDeliveredEvent {
  conversationId: string;
  recipientId: string;
  messageIds: string[];
  deliveredAt: string;
}

export interface PresenceEvent {
  userId: string;
  online: boolean;
}

export interface PresenceSnapshot {
  userIds: string[];
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface MessagesPage {
  messages: Message[];
  nextBefore: string | null;
}

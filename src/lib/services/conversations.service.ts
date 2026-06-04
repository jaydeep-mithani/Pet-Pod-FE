import { api } from "@/lib/api/client";
import type {
  Conversation,
  ConversationListItem,
  Message,
  MessagesPage,
} from "@/types";

export interface SendMessageInput {
  body: string;
}

export interface ListMessagesQuery {
  before?: string;
  limit?: number;
}

function buildMessageQuery(q: ListMessagesQuery = {}): string {
  const params = new URLSearchParams();
  if (q.before) params.set("before", q.before);
  if (q.limit) params.set("limit", String(q.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const conversationsService = {
  list: () => api.get<ConversationListItem[]>("/conversations"),

  createOrGet: (petId: string) =>
    api.post<Conversation>("/conversations", { petId }),

  getById: (id: string) => api.get<Conversation>(`/conversations/${id}`),

  listMessages: (id: string, q: ListMessagesQuery = {}) =>
    api.get<MessagesPage>(
      `/conversations/${id}/messages${buildMessageQuery(q)}`,
    ),

  sendMessage: (id: string, input: SendMessageInput) =>
    api.post<Message>(`/conversations/${id}/messages`, input),

  markRead: (id: string) =>
    api.post<{ messageIds: string[]; readAt: string }>(
      `/conversations/${id}/read`,
    ),

  markDelivered: (id: string) =>
    api.post<{ messageIds: string[]; deliveredAt: string }>(
      `/conversations/${id}/delivered`,
    ),
};

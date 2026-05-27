"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { disconnectSocket, getSocket } from "@/lib/realtime/socket";
import { conversationsService } from "@/lib/services/conversations.service";
import type {
  ConversationListItem,
  Message,
  MessagesDeliveredEvent,
  MessagesReadEvent,
  PresenceEvent,
  PresenceSnapshot,
  TypingEvent,
} from "@/types";

interface ChatContextValue {
  /** Unread count per conversation id (only conversations with > 0 shown). */
  unreadByConv: Record<string, number>;
  totalUnread: number;
  /** Online users by id. */
  onlineUserIds: Set<string>;
  /** typingByConv[convId] = set of userIds currently typing in that conv. */
  typingByConv: Record<string, Set<string>>;
  /**
   * Set the conversation the user is actively viewing. New messages for this
   * conv won't increment the unread count, and we'll auto-mark-read.
   */
  setActiveConversation: (id: string | null) => void;
  /** Subscribe to message:new events. Returns an unsubscribe fn. */
  onMessage: (handler: (msg: Message) => void) => () => void;
  /** Subscribe to messages:read events. */
  onMessagesRead: (handler: (event: MessagesReadEvent) => void) => () => void;
  /** Subscribe to messages:delivered events. */
  onMessagesDelivered: (
    handler: (event: MessagesDeliveredEvent) => void,
  ) => () => void;
  /** Mark all foreign messages as delivered. Idempotent. */
  markDelivered: (conversationId: string) => Promise<void>;
  /** Mark a conversation read on the server. */
  markRead: (conversationId: string) => Promise<void>;
  /** Emit a typing:start / typing:stop for a conversation. */
  emitTyping: (conversationId: string, typing: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const userId = user?.id ?? null;

  const [unreadByConv, setUnreadByConv] = useState<Record<string, number>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingByConv, setTypingByConv] = useState<Record<string, Set<string>>>(
    {},
  );

  const activeConvRef = useRef<string | null>(null);
  const setActiveConversation = useCallback((id: string | null) => {
    activeConvRef.current = id;
    if (id) {
      // Optimistically clear the badge for the conv we're now viewing.
      setUnreadByConv((curr) => {
        if (!(id in curr)) return curr;
        const { [id]: _drop, ...rest } = curr;
        void _drop;
        return rest;
      });
    }
  }, []);

  const messageHandlers = useRef(new Set<(msg: Message) => void>());
  const readHandlers = useRef(new Set<(event: MessagesReadEvent) => void>());
  const deliveredHandlers = useRef(
    new Set<(event: MessagesDeliveredEvent) => void>(),
  );
  const typingTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const onMessage = useCallback((handler: (msg: Message) => void) => {
    messageHandlers.current.add(handler);
    return () => {
      messageHandlers.current.delete(handler);
    };
  }, []);

  const onMessagesRead = useCallback(
    (handler: (event: MessagesReadEvent) => void) => {
      readHandlers.current.add(handler);
      return () => {
        readHandlers.current.delete(handler);
      };
    },
    [],
  );

  const onMessagesDelivered = useCallback(
    (handler: (event: MessagesDeliveredEvent) => void) => {
      deliveredHandlers.current.add(handler);
      return () => {
        deliveredHandlers.current.delete(handler);
      };
    },
    [],
  );

  // Seed the unread map from /conversations whenever we go authed.
  useEffect(() => {
    if (status !== "authed") {
      setUnreadByConv({});
      setOnlineUserIds(new Set());
      setTypingByConv({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list: ConversationListItem[] = await conversationsService.list();
        if (cancelled) return;
        const seed: Record<string, number> = {};
        for (const c of list) {
          if (c.unreadCount > 0) seed[c.id] = c.unreadCount;
        }
        setUnreadByConv(seed);
      } catch {
        /* ignore — chat will still function */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  // Socket lifecycle: connect/disconnect with auth status; subscribe to events.
  useEffect(() => {
    if (status !== "authed") return;
    const socket = getSocket();

    const onNewMessage = (msg: Message) => {
      // For foreign messages NOT in the active conversation:
      //   1. increment the unread badge
      //   2. fire markDelivered — this is the receiver's device acknowledging
      //      the message, and gives the sender the genuine "delivered" tick
      //      *before* the recipient opens the chat (which is when read fires).
      if (
        msg.senderId !== userId &&
        activeConvRef.current !== msg.conversationId
      ) {
        setUnreadByConv((curr) => ({
          ...curr,
          [msg.conversationId]: (curr[msg.conversationId] ?? 0) + 1,
        }));
        void conversationsService
          .markDelivered(msg.conversationId)
          .catch(() => {
            /* idempotent; will re-fire next time */
          });
      }
      messageHandlers.current.forEach((h) => h(msg));
    };

    const onMessagesReadEvent = (event: MessagesReadEvent) => {
      // If I'm the reader, ensure my unread is cleared for this conv.
      if (event.readerId === userId) {
        setUnreadByConv((curr) => {
          if (!(event.conversationId in curr)) return curr;
          const { [event.conversationId]: _drop, ...rest } = curr;
          void _drop;
          return rest;
        });
      }
      readHandlers.current.forEach((h) => h(event));
    };

    const onMessagesDeliveredEvent = (event: MessagesDeliveredEvent) => {
      deliveredHandlers.current.forEach((h) => h(event));
    };

    const onPresence = (event: PresenceEvent) => {
      setOnlineUserIds((curr) => {
        const next = new Set(curr);
        if (event.online) next.add(event.userId);
        else next.delete(event.userId);
        return next;
      });
    };

    const onPresenceSnapshot = (snap: PresenceSnapshot) => {
      setOnlineUserIds(new Set(snap.userIds));
    };

    const setTyping = (
      event: TypingEvent,
      typing: boolean,
    ) => {
      setTypingByConv((curr) => {
        const set = new Set(curr[event.conversationId] ?? []);
        if (typing) set.add(event.userId);
        else set.delete(event.userId);
        if (set.size === 0) {
          const { [event.conversationId]: _drop, ...rest } = curr;
          void _drop;
          return rest;
        }
        return { ...curr, [event.conversationId]: set };
      });
    };

    const onTypingStart = (event: TypingEvent) => {
      setTyping(event, true);
      const key = `${event.conversationId}:${event.userId}`;
      const existing = typingTimers.current.get(key);
      if (existing) clearTimeout(existing);
      // Auto-clear if no follow-up — longer than the sender's re-emit cadence
      // so legitimate continuous typing doesn't drop the indicator.
      typingTimers.current.set(
        key,
        setTimeout(() => {
          setTyping(event, false);
          typingTimers.current.delete(key);
        }, 8000),
      );
    };

    const onTypingStop = (event: TypingEvent) => {
      setTyping(event, false);
      const key = `${event.conversationId}:${event.userId}`;
      const existing = typingTimers.current.get(key);
      if (existing) {
        clearTimeout(existing);
        typingTimers.current.delete(key);
      }
    };

    socket.on("message:new", onNewMessage);
    socket.on("messages:read", onMessagesReadEvent);
    socket.on("messages:delivered", onMessagesDeliveredEvent);
    socket.on("presence:update", onPresence);
    socket.on("presence:snapshot", onPresenceSnapshot);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    // Ask for a presence snapshot on (re)connect.
    const requestSnapshot = () => socket.emit("presence:request");
    if (socket.connected) requestSnapshot();
    socket.on("connect", requestSnapshot);

    const timers = typingTimers.current;
    return () => {
      socket.off("message:new", onNewMessage);
      socket.off("messages:read", onMessagesReadEvent);
      socket.off("messages:delivered", onMessagesDeliveredEvent);
      socket.off("presence:update", onPresence);
      socket.off("presence:snapshot", onPresenceSnapshot);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off("connect", requestSnapshot);
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [status, userId]);

  // Disconnect socket when we leave the authed state.
  useEffect(() => {
    if (status === "guest") disconnectSocket();
  }, [status]);

  const markRead = useCallback(async (conversationId: string) => {
    try {
      await conversationsService.markRead(conversationId);
    } catch {
      /* ignore — local state will catch up on next sync */
    }
  }, []);

  const markDelivered = useCallback(async (conversationId: string) => {
    try {
      await conversationsService.markDelivered(conversationId);
    } catch {
      /* ignore */
    }
  }, []);

  const emitTyping = useCallback(
    (conversationId: string, typing: boolean) => {
      const socket = getSocket();
      socket.emit(typing ? "typing:start" : "typing:stop", { conversationId });
    },
    [],
  );

  const totalUnread = useMemo(
    () => Object.values(unreadByConv).reduce((a, b) => a + b, 0),
    [unreadByConv],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      unreadByConv,
      totalUnread,
      onlineUserIds,
      typingByConv,
      setActiveConversation,
      onMessage,
      onMessagesRead,
      onMessagesDelivered,
      markDelivered,
      markRead,
      emitTyping,
    }),
    [
      unreadByConv,
      totalUnread,
      onlineUserIds,
      typingByConv,
      setActiveConversation,
      onMessage,
      onMessagesRead,
      onMessagesDelivered,
      markDelivered,
      markRead,
      emitTyping,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}

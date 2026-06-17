"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button, UserAvatar } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useChat } from "@/lib/chat/ChatProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { conversationsService } from "@/lib/services/conversations.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { FIELD_CHROME } from "@/components/ui/Input";
import { cn, firstName, formatRelativeTime, petShortName } from "@/utils";
import type { Conversation, Message } from "@/types";

// Thread wash behind the bubbles. The playful rose tint isn't a remapped
// stop, so it branches: calm gets a flat warm sand, bold the near-black stage.
const THREAD_BG: Record<MotionVibe, string> = {
  playful: "bg-gradient-to-b from-rose-50/30 to-white",
  calm: "bg-[#f7f6f3]",
  bold: "bg-[#0a0a12]",
};

// hover:bg-gray-100 flashes light-on-dark in bold, so neutral row/button
// hovers branch per vibe.
const NEUTRAL_HOVER: Record<MotionVibe, string> = {
  playful: "hover:bg-gray-100 hover:text-gray-900",
  calm: "hover:bg-stone-100 hover:text-gray-900",
  bold: "hover:bg-white/10 hover:text-white",
};

// Other-party bubble + composer/header chrome. Calm flattens to hairline
// rules; bold goes dark with a neon hairline.
const OTHER_BUBBLE: Record<MotionVibe, string> = {
  playful: "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200",
  calm: "bg-white text-gray-900 ring-1 ring-stone-200",
  bold: "bg-[#13131e] text-gray-100 ring-1 ring-fuchsia-500/30",
};

// Own bubble. Brand gradient auto-remaps; bold adds a thin neon edge + glow.
const OWN_BUBBLE: Record<MotionVibe, string> = {
  playful:
    "rounded-br-md bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm",
  calm: "rounded-br-md bg-gradient-to-br from-pink-500 to-purple-600 text-white",
  bold: "rounded-br-md bg-gradient-to-br from-pink-500 to-purple-600 text-white border border-fuchsia-500/40 shadow-[0_0_18px_-4px_rgba(217,70,239,0.5)]",
};

// Re-emit typing:start at most this often while the user is actively typing,
// so a long pause mid-message doesn't drop the indicator on the other side.
const TYPING_REEMIT_MS = 3000;
// Time of inactivity after which we emit typing:stop.
const TYPING_STOP_AFTER_MS = 5000;

export default function ConversationDetailPage() {
  const status = useRequireAuth();
  const { user } = useAuth();
  const { vibe } = useMotionVibe();
  const {
    setActiveConversation,
    markRead,
    markDelivered,
    onMessage,
    onMessagesRead,
    onMessagesDelivered,
    onlineUserIds,
    typingByConv,
    emitTyping,
  } = useChat();
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const router = useRouter();

  const [conv, setConv] = useState<Conversation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextBefore, setNextBefore] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef(0);
  const isTypingRef = useRef(false);

  const otherUser =
    conv && user
      ? conv.ownerId === user.id
        ? conv.adopter
        : conv.owner
      : null;

  // Tell ChatProvider we're viewing this conv so new messages here don't
  // count as unread.
  useEffect(() => {
    if (!conversationId) return;
    setActiveConversation(conversationId);
    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation]);

  // Initial load
  useEffect(() => {
    if (!conversationId || status !== "authed") return;
    let cancelled = false;
    (async () => {
      try {
        const [c, page] = await Promise.all([
          conversationsService.getById(conversationId),
          conversationsService.listMessages(conversationId, { limit: 50 }),
        ]);
        if (cancelled) return;
        setConv(c);
        setMessages([...page.messages].reverse());
        setNextBefore(page.nextBefore);
        // Mark anything we just received as delivered + read.
        void markDelivered(conversationId);
        void markRead(conversationId);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? "Conversation not found."
            : err instanceof ApiError && err.status === 403
              ? "You can't view this conversation."
              : "Couldn't load this conversation.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, status, markRead, markDelivered]);

  // Subscribe via ChatProvider; auto-mark delivered+read on foreign incoming.
  useEffect(() => {
    if (status !== "authed" || !conversationId) return;
    return onMessage((msg) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((curr) =>
        curr.some((m) => m.id === msg.id) ? curr : [...curr, msg],
      );
      if (msg.senderId !== user?.id) {
        void markDelivered(conversationId);
        void markRead(conversationId);
      }
    });
  }, [conversationId, status, user?.id, onMessage, markRead, markDelivered]);

  // Delivered event → flip gray double-check.
  useEffect(() => {
    if (status !== "authed") return;
    return onMessagesDelivered((event) => {
      if (event.conversationId !== conversationId) return;
      setMessages((curr) =>
        curr.map((m) =>
          event.messageIds.includes(m.id)
            ? { ...m, deliveredAt: event.deliveredAt }
            : m,
        ),
      );
    });
  }, [conversationId, status, onMessagesDelivered]);

  // Read event → flip blue double-check.
  useEffect(() => {
    if (status !== "authed") return;
    return onMessagesRead((event) => {
      if (event.conversationId !== conversationId) return;
      setMessages((curr) =>
        curr.map((m) =>
          event.messageIds.includes(m.id)
            ? {
                ...m,
                // Mark delivered implicitly if missing.
                deliveredAt: m.deliveredAt ?? event.readAt,
                readAt: event.readAt,
              }
            : m,
        ),
      );
    });
  }, [conversationId, status, onMessagesRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const loadMore = useCallback(async () => {
    if (!nextBefore || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await conversationsService.listMessages(conversationId, {
        before: nextBefore,
        limit: 50,
      });
      setMessages((curr) => [...page.messages.slice().reverse(), ...curr]);
      setNextBefore(page.nextBefore);
    } catch {
      toast.error("Couldn't load older messages.");
    } finally {
      setLoadingMore(false);
    }
  }, [conversationId, nextBefore, loadingMore]);

  const sendTypingStop = useCallback(() => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    lastTypingEmitRef.current = 0;
    emitTyping(conversationId, false);
  }, [conversationId, emitTyping]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDraft(value);
    if (value.length === 0) {
      sendTypingStop();
      return;
    }
    const now = Date.now();
    // Throttled re-emit so the indicator survives long pauses while the user
    // is still actively typing a longer message.
    if (now - lastTypingEmitRef.current >= TYPING_REEMIT_MS) {
      isTypingRef.current = true;
      lastTypingEmitRef.current = now;
      emitTyping(conversationId, true);
    }
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(
      sendTypingStop,
      TYPING_STOP_AFTER_MS,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || sending) return;
    setSending(true);
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    sendTypingStop();
    try {
      const msg = await conversationsService.sendMessage(conversationId, {
        body: trimmed,
      });
      setMessages((curr) =>
        curr.some((m) => m.id === msg.id) ? curr : [...curr, msg],
      );
      setDraft("");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't send message.";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  // Cleanup typing on unmount.
  useEffect(() => {
    return () => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      if (isTypingRef.current) emitTyping(conversationId, false);
    };
  }, [conversationId, emitTyping]);

  if (loadError) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-700">{loadError}</p>
        <Link
          href={ROUTES.chat}
          className="mt-3 inline-block text-sm font-medium text-pink-600 hover:text-pink-700"
        >
          Back to messages
        </Link>
      </main>
    );
  }

  if (status !== "authed" || !conv || !user) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  const cover = conv.pet.photos[0]?.url;
  const petLabel = petShortName(conv.pet);
  const otherOnline = otherUser ? onlineUserIds.has(otherUser.id) : false;
  const otherTyping =
    !!otherUser && (typingByConv[conversationId]?.has(otherUser.id) ?? false);

  return (
    <main className="flex h-[100svh] flex-col bg-white pt-20">
      <header className="shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => router.push(ROUTES.chat)}
            aria-label="Back to messages"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors",
              NEUTRAL_HOVER[vibe],
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="relative h-11 w-11 shrink-0">
            {otherUser && (
              <Link
                href={ROUTES.publicProfile(otherUser.id)}
                aria-label={`View ${otherUser.name}'s profile`}
                className="block transition-transform hover:scale-105"
              >
                <UserAvatar
                  name={otherUser.name}
                  avatarUrl={otherUser.avatarUrl}
                  size="md"
                  className="!h-11 !w-11 text-sm"
                />
              </Link>
            )}
            <Link
              href={ROUTES.petDetail(conv.pet.id)}
              aria-label={`View ${petLabel}`}
              className="absolute -right-1.5 -bottom-1.5 inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg bg-gray-100 ring-2 ring-white transition-transform hover:scale-110"
            >
              {cover ? (
                <Image
                  src={cover}
                  alt=""
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs" aria-hidden>
                  🐾
                </span>
              )}
            </Link>
          </div>
          <div className="min-w-0 flex-1">
            {vibe === "bold" && (
              <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                {"// chat"}
              </p>
            )}
            <p className="truncate text-sm font-semibold text-gray-900">
              {otherUser ? (
                <Link
                  href={ROUTES.publicProfile(otherUser.id)}
                  className="hover:text-pink-600"
                >
                  {otherUser.name}
                </Link>
              ) : null}
              {otherOnline && (
                <span className="ml-1.5 inline-flex items-center gap-1 align-middle text-[10px] font-normal text-emerald-600">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  online
                </span>
              )}
            </p>
            <p className="truncate text-xs text-gray-500">
              about{" "}
              <Link
                href={ROUTES.petDetail(conv.pet.id)}
                className="font-medium hover:text-pink-600"
              >
                {petLabel}
              </Link>
            </p>
          </div>
        </div>
      </header>

      <div className={cn("flex-1 overflow-y-auto", THREAD_BG[vibe])}>
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-6 sm:px-6">
          {nextBefore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-pink-600 shadow-sm ring-1 ring-gray-200 hover:bg-pink-50 disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load earlier"}
              </button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200">
              <p className="text-sm text-gray-600">
                Say hi to {otherUser ? firstName(otherUser) : "the owner"} about{" "}
                {petLabel}.
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const mine = msg.senderId === user.id;
            const prev = messages[i - 1];
            const showAvatar =
              !mine && (!prev || prev.senderId !== msg.senderId);
            const showTime =
              !prev ||
              new Date(msg.createdAt).getTime() -
                new Date(prev.createdAt).getTime() >
                5 * 60 * 1000;
            const isRead = !!msg.readAt;
            const isDelivered = !!msg.deliveredAt;
            const ReadIcon = isDelivered ? CheckCheck : Check;
            const iconClass = isRead
              ? "text-sky-300"
              : isDelivered
                ? "text-white/85"
                : "text-white/55";
            const stateLabel = isRead
              ? "Read"
              : isDelivered
                ? "Delivered"
                : "Sent";
            return (
              <div key={msg.id} className="flex flex-col gap-1">
                {showTime && (
                  <div className="self-center text-[10px] uppercase tracking-wider text-gray-400">
                    {formatRelativeTime(msg.createdAt)}
                  </div>
                )}
                <div
                  className={cn(
                    "flex items-end gap-2",
                    mine ? "justify-end" : "justify-start",
                  )}
                >
                  {!mine &&
                    (showAvatar ? (
                      <UserAvatar
                        name={otherUser?.name ?? "?"}
                        avatarUrl={otherUser?.avatarUrl ?? null}
                        size="sm"
                      />
                    ) : (
                      <div className="w-8" />
                    ))}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                      mine
                        ? OWN_BUBBLE[vibe]
                        : cn("rounded-bl-md", OTHER_BUBBLE[vibe]),
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.body}
                    </p>
                    {mine && (
                      <div className="mt-0.5 flex items-center justify-end">
                        <ReadIcon
                          className={cn("h-3.5 w-3.5", iconClass)}
                          aria-label={stateLabel}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {otherTyping && otherUser && (
            <div className="flex items-end gap-2">
              <UserAvatar
                name={otherUser.name}
                avatarUrl={otherUser.avatarUrl}
                size="sm"
              />
              <div
                className={cn(
                  "rounded-2xl rounded-bl-md px-4 py-2.5",
                  OTHER_BUBBLE[vibe],
                )}
              >
                <TypingDots vibe={vibe} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-gray-200 bg-white"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3 sm:px-6">
          <textarea
            value={draft}
            onChange={handleDraftChange}
            onBlur={sendTypingStop}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit(e);
              }
            }}
            placeholder="Write a message…"
            rows={1}
            maxLength={2000}
            disabled={sending}
            className={cn(
              "flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none",
              FIELD_CHROME[vibe].focus,
              FIELD_CHROME[vibe].hover,
            )}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={sending || draft.trim().length === 0}
            icon={<Send className="h-4 w-4" />}
            iconPosition="right"
          >
            Send
          </Button>
        </div>
      </form>
    </main>
  );
}

const TYPING_DOT: Record<MotionVibe, string> = {
  playful: "bg-gray-400",
  calm: "bg-stone-400",
  bold: "bg-cyan-300",
};

const TypingDots: React.FC<{ vibe: MotionVibe }> = ({ vibe }) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={cn(
          "h-1.5 w-1.5 animate-bounce rounded-full",
          TYPING_DOT[vibe],
        )}
        style={{ animationDelay: `${i * 120}ms` }}
      />
    ))}
  </div>
);

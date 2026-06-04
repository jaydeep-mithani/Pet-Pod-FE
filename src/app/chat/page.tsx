"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Footer, UserAvatar } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useChat } from "@/lib/chat/ChatProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { conversationsService } from "@/lib/services/conversations.service";
import { ROUTES } from "@/lib/routes";
import { cn, formatRelativeTime, petShortName } from "@/utils";
import type { ConversationListItem } from "@/types";

export default function ChatListPage() {
  const status = useRequireAuth();
  const { user } = useAuth();
  const { unreadByConv, onlineUserIds, onMessage } = useChat();
  const [conversations, setConversations] = useState<
    ConversationListItem[] | null
  >(null);

  // Refresh the list whenever a new message arrives (cheap; the user just
  // sees the latest activity bubble up).
  useEffect(() => {
    return onMessage(() => {
      void conversationsService
        .list()
        .then((data) => setConversations(data))
        .catch(() => {
          /* ignore */
        });
    });
  }, [onMessage]);

  useEffect(() => {
    if (status !== "authed") return;
    let cancelled = false;
    (async () => {
      try {
        const data = await conversationsService.list();
        if (!cancelled) setConversations(data);
      } catch {
        if (!cancelled) setConversations([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <main className="min-h-screen bg-white pt-28 sm:pt-32">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Messages
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Conversations with people about pets.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {conversations === null ? (
            <ConversationsSkeleton />
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              {conversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  currentUserId={user?.id ?? ""}
                  unreadCount={unreadByConv[conv.id] ?? conv.unreadCount ?? 0}
                  onlineUserIds={onlineUserIds}
                />
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

interface ConversationRowProps {
  conv: ConversationListItem;
  currentUserId: string;
  unreadCount: number;
  onlineUserIds: Set<string>;
}

const ConversationRow: React.FC<ConversationRowProps> = ({
  conv,
  currentUserId,
  unreadCount,
  onlineUserIds,
}) => {
  const router = useRouter();
  const otherUser = conv.ownerId === currentUserId ? conv.adopter : conv.owner;
  const cover = conv.pet.photos[0]?.url;
  const lastMsg = conv.messages[0];
  const snippet = lastMsg
    ? `${lastMsg.senderId === currentUserId ? "You: " : ""}${lastMsg.body}`
    : "No messages yet — say hi.";
  const time = lastMsg
    ? formatRelativeTime(lastMsg.createdAt)
    : formatRelativeTime(conv.updatedAt);
  const otherOnline = onlineUserIds.has(otherUser.id);
  const hasUnread = unreadCount > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => router.push(`${ROUTES.chat}/${conv.id}`)}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-pink-50/40",
          hasUnread && "bg-pink-50/30",
        )}
      >
        <div className="relative h-14 w-14 shrink-0">
          <UserAvatar
            name={otherUser.name}
            avatarUrl={otherUser.avatarUrl}
            size="lg"
          />
          <span
            className={cn(
              "absolute -right-1.5 -bottom-1.5 inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-gray-100 ring-2 ring-white",
              hasUnread && "ring-pink-50",
            )}
            aria-hidden
          >
            {cover ? (
              <Image
                src={cover}
                alt=""
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm">🐾</span>
            )}
          </span>
          {otherOnline && (
            <span
              aria-label={`${otherUser.name} is online`}
              className="absolute -right-0.5 top-0 inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {otherUser.name}{" "}
              <span className="font-normal text-gray-500">
                · {petShortName(conv.pet)}
              </span>
            </p>
            <span className="shrink-0 text-xs text-gray-500">{time}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm",
                hasUnread ? "font-semibold text-gray-900" : "text-gray-600",
              )}
            >
              {snippet}
            </p>
            {hasUnread && (
              <span className="ml-2 inline-flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
};

const EmptyState: React.FC = () => (
  <div className="mx-auto max-w-md rounded-3xl border border-rose-100 bg-rose-50/40 p-10 text-center">
    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 text-pink-600">
      <MessageCircle className="h-6 w-6" aria-hidden />
    </div>
    <h2 className="text-lg font-semibold text-gray-900">No messages yet</h2>
    <p className="mt-2 text-sm text-gray-600">
      Find a pet you&apos;d like to adopt and message the owner. Your
      conversations will show up here.
    </p>
    <div className="mt-6">
      <Link
        href={ROUTES.pets}
        className="inline-flex items-center rounded-full bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-700"
      >
        Browse pets
      </Link>
    </div>
  </div>
);

const ConversationsSkeleton: React.FC = () => (
  <ul className="divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
    {[0, 1, 2, 3].map((i) => (
      <li key={i} className="flex items-center gap-3 px-4 py-3">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </li>
    ))}
  </ul>
);

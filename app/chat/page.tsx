"use client";

import { useEffect, useState } from "react";

import { RealtimeChat } from "@/components/realtime-chat";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/hooks/use-realtime-chat";

export default function ChatPage() {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("test_messages")
        .select("*")
        .eq("room_name", "my-chat-room")
        .order("created_at", { ascending: true });

      if (data) {
        setInitialMessages(
          data.map((msg) => ({
            id: msg.id,
            content: msg.content,
            user: { name: msg.user_name },
            createdAt: msg.created_at,
          }))
        );
      }
    };

    loadMessages();
  }, [supabase]);

  return (
    <RealtimeChat
      roomName="my-chat-room"
      username="john_doe"
      messages={initialMessages}
    />
  );
}

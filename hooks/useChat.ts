"use client";

import { useState, useCallback, useRef } from "react";
import { Message, TriageResult } from "@/lib/types";
import { hasTriage } from "@/lib/utils";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  // Keep a ref to the last failed message text so we can retry it
  const lastFailedInput = useRef<string | null>(null);

  const isSendingRef = useRef(false);

  const triageResult: TriageResult | null = hasTriage(messages);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading || isSendingRef.current) return;

      isSendingRef.current = true;
      lastFailedInput.current = null;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Request failed");
        }

        if (data.fallback) {
          setIsFallback(true);
        }

        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(msg);
        // Stash the input so the user can retry with one click
        lastFailedInput.current = content.trim();
        // Remove the optimistically-added user message
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
        isSendingRef.current = false;
      }
    },
    [messages, isLoading]
  );

  /** Retry the last failed message */
  const retry = useCallback(() => {
    const text = lastFailedInput.current;
    if (text) {
      setError(null);
      sendMessage(text);
    }
  }, [sendMessage]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsFallback(false);
    lastFailedInput.current = null;
    isSendingRef.current = false;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isLoading,
    error,
    isFallback,
    triageResult,
    sendMessage,
    retry,
    reset,
    clearError,
    canRetry: lastFailedInput.current !== null,
  };
}

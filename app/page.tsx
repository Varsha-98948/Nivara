"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInterface from "@/components/ChatInterface";
import TriageResultCard from "@/components/TriageResultCard";
import HealthcareFinder from "@/components/HealthcareFinder";
import { useChat } from "@/hooks/useChat";
import { AppView } from "@/lib/types";

export default function Home() {
  const [view, setView] = useState<AppView>("welcome");
  const [input, setInput] = useState("");

  const {
    messages,
    isLoading,
    error,
    isFallback,
    triageResult,
    sendMessage,
    retry,
    reset,
    clearError,
    canRetry,
  } = useChat();

  const handleStart = () => setView("chat");

  const handleSend = async (overrideText?: string) => {
    const text = (typeof overrideText === "string" ? overrideText : input).trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  const handleReset = () => {
    reset();
    setInput("");
    setView("welcome");
  };

  // Auto-navigate to triage when assessment arrives and user is in chat
  // (handled via the banner in ChatInterface, so no auto-redirect here)

  return (
    <>
      {view === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {view === "chat" && (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onReset={handleReset}
          onViewTriage={() => setView("triage")}
          triageResult={triageResult}
          error={error}
          onRetry={retry}
          onClearError={clearError}
          canRetry={canRetry}
          isFallback={isFallback}
        />
      )}

      {view === "triage" && triageResult && (
        <TriageResultCard
          result={triageResult}
          onBack={() => setView("chat")}
          onFindCare={() => setView("finder")}
        />
      )}

      {view === "finder" && (
        <HealthcareFinder
          urgency={triageResult?.urgency ?? null}
          onBack={() => setView(triageResult ? "triage" : "chat")}
        />
      )}
    </>
  );
}

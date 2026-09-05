"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "../components/ai/ChatHeader";
import ChatCard from "../components/ai/ChatCard";
import ChatInput from "../components/ai/ChatInput";
import ChatEmptyState from "../components/ai/ChatEmptyState";
import ChatLoadingIndicator from "../components/ai/ChatLoadingIndicator";
import { AlertCircle, RotateCw } from "lucide-react";
import type { ChatMessage, ChatResponse } from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const SESSION_KEY = "maanak_ai_session_id";
const MESSAGES_KEY = "maanak_ai_messages";

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session from sessionStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedSessionId = sessionStorage.getItem(SESSION_KEY);
      const savedMessages = sessionStorage.getItem(MESSAGES_KEY);

      if (savedSessionId) {
        setSessionId(savedSessionId);
      }
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const promptParam = urlParams.get("prompt");
        if (promptParam) {
          setInputValue(promptParam);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save messages & session_id to sessionStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      if (sessionId) {
        sessionStorage.setItem(SESSION_KEY, sessionId);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }

      if (messages.length > 0) {
        sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(MESSAGES_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages, sessionId, isClient]);

  // Auto-scroll to bottom when messages or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId || null,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText || "Failed to process chat request"}`
        );
      }

      const data: ChatResponse = await response.json();

      // Update session ID if returned from server
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        citations: data.citations || [],
        confidence: data.confidence,
        limitations: data.limitations,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("AI Chat error:", err);
      setError(err.message || "Failed to connect to the AI Assistant server.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setInputValue("");
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(MESSAGES_KEY);
    } catch {
      // Ignore
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setError(null);
    try {
      sessionStorage.removeItem(MESSAGES_KEY);
    } catch {
      // Ignore
    }
  };

  const handleRetryLast = () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] w-full max-w-5xl mx-auto">
      {/* Top AI Header */}
      <ChatHeader
        sessionId={sessionId}
        messageCount={messages.length}
        onNewChat={handleNewChat}
        onClearMessages={handleClearMessages}
        loading={loading}
      />

      {/* Main Conversation Stream */}
      <div className="flex-1 py-4 sm:py-6 space-y-2">
        {messages.length === 0 ? (
          <ChatEmptyState onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatCard
                key={msg.id}
                message={msg}
                onRetry={msg.role === "assistant" ? () => handleRetryLast() : undefined}
              />
            ))}

            {loading && <ChatLoadingIndicator />}
          </div>
        )}

        {/* Inline Error Callout */}
        {error && (
          <div className="my-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <p className="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-300 truncate">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetryLast}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-rose-700 active:scale-95 transition-all"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed/Sticky Bottom Chat Input Area */}
      <div className="sticky bottom-0 z-20 pt-2 pb-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          disabled={loading}
        />
      </div>
    </div>
  );
}
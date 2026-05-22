"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronRight, Sparkles, X } from "lucide-react";
import { useI18n, useTr } from "@/lib/i18n";
import { useUI } from "@/lib/ui-context";
import { cn } from "@/lib/cn";
import { getReply, SUGGESTED, WELCOME, type AssistantReply } from "./replies";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; reply: AssistantReply };

let counter = 0;
const uid = () => `m${++counter}`;

export function Assistant() {
  const { assistantOpen, openAssistant, closeAssistant } = useUI();
  const { lang } = useI18n();
  const tr = useTr();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed welcome the first time it opens.
  useEffect(() => {
    if (assistantOpen && messages.length === 0) {
      setMessages([{ id: uid(), role: "assistant", reply: { text: WELCOME[lang] } }]);
    }
  }, [assistantOpen, messages.length, lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    const userMsg: Msg = { id: uid(), role: "user", text: value };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setTyping(true);

    // Build API messages from conversation so far + the new user turn.
    const apiMessages = next
      .map((m) => {
        if (m.role === "user") return { role: "user" as const, content: m.text };
        const r = m.reply;
        const body = [r.text, ...(r.bullets ?? []).map((b) => `• ${b}`)].join("\n");
        return { role: "assistant" as const, content: body };
      })
      .filter((m) => m.content && m.content.trim().length > 0);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, lang }),
      });
      if (!res.ok) throw new Error(`api_${res.status}`);
      const data = (await res.json()) as { text?: string };
      const replyText = (data.text ?? "").trim();
      if (!replyText) throw new Error("empty");
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", reply: { text: replyText } },
      ]);
    } catch {
      // Fallback to keyword reply when the API is unavailable.
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", reply: getReply(value, lang) },
      ]);
    } finally {
      setTyping(false);
    }
  }

  const hasUserMsg = messages.some((m) => m.role === "user");

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!assistantOpen && (
          <motion.button
            type="button"
            data-tour="assistant"
            onClick={openAssistant}
            aria-label={tr({ es: "Abrir copiloto IA", en: "Open AI copilot" })}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
            className="fixed bottom-20 right-4 z-[80] flex items-center gap-2 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 px-3.5 py-3 text-neutral-950 shadow-xl shadow-accent-600/35 lg:bottom-6 lg:right-6"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-gold" />
            <Sparkles className="size-5" />
            <span className="hidden text-sm font-extrabold sm:block">
              {tr({ es: "Copiloto IA", en: "AI Copilot" })}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {assistantOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[95] bg-neutral-950/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAssistant}
            />
            <motion.div
              role="dialog"
              aria-label="AirPath AI copilot"
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 40, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="fixed inset-0 z-[100] flex flex-col border-hairline bg-surface sm:inset-auto sm:bottom-4 sm:right-4 sm:top-4 sm:w-[412px] sm:rounded-3xl sm:border sm:shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-hairline p-4">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-neutral-950">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-content">
                    {tr({ es: "Copiloto AirPath", en: "AirPath Copilot" })}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-content-muted">
                    <span className="size-1.5 rounded-full bg-success-500" />
                    {tr({ es: "IA · datos de tu plataforma", en: "AI · your platform data" })}
                  </p>
                </div>
                <button
                  onClick={closeAssistant}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-lg text-content-muted transition hover:bg-surface-2 hover:text-content"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary-600 px-3.5 py-2.5 text-sm font-medium text-white">
                        {m.text}
                      </p>
                    </div>
                  ) : (
                    <ReplyBubble key={m.id} reply={m.reply} onCta={closeAssistant} />
                  ),
                )}
                {typing && <TypingBubble />}
              </div>

              {/* Suggestions + input */}
              <div className="border-t border-hairline p-3">
                {!hasUserMsg && (
                  <div className="no-scrollbar mb-2.5 flex gap-2 overflow-x-auto">
                    {SUGGESTED[lang].map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="shrink-0 rounded-full border border-primary-500/30 bg-primary-600/10 px-3 py-1.5 text-xs font-semibold text-purple-ink transition hover:bg-primary-600/20"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={tr({ es: "Escribí tu pregunta…", en: "Type your question…" })}
                    className="h-11 flex-1 rounded-xl border border-hairline bg-surface-2 px-3.5 text-sm text-content outline-none placeholder:text-content-muted/70 focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    aria-label="Send"
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-500 disabled:opacity-40"
                  >
                    <ArrowUp className="size-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ReplyBubble({ reply, onCta }: { reply: AssistantReply; onCta: () => void }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-neutral-950">
        <Sparkles className="size-4" />
      </span>
      <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border border-hairline bg-surface-2 px-3.5 py-3">
        <p className="whitespace-pre-line text-sm leading-relaxed text-content">{reply.text}</p>
        {reply.bullets && (
          <ul className="mt-2.5 space-y-1.5">
            {reply.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-content">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500" />
                {b}
              </li>
            ))}
          </ul>
        )}
        {reply.cta && (
          <a
            href={reply.cta.href}
            onClick={onCta}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary-500"
          >
            {reply.cta.label}
            <ChevronRight className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-neutral-950">
        <Sparkles className="size-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-hairline bg-surface-2 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-content-muted"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

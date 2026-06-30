'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { askAssistant } from '@/lib/api';
import { priceLabel } from '@/lib/format';
import type { AssistantMessage, Property } from '@/types';
import { useVoiceInput } from '@/lib/useVoice';

interface Turn extends AssistantMessage {
  suggested?: Property[];
}

const SUGGESTIONS = [
  'Sea-view penthouse in Mumbai',
  'Villa in Goa with a pool',
  'Something to rent in Bengaluru',
];

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: 'assistant',
      content:
        "Hi, I’m your Grovyn concierge. Tell me the city, budget, or vibe you’re after and I’ll curate homes you can walk through in 3D.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { supported, listening, start, transcript, reset } = useVoiceInput();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    reset();
    setInput('');
    const next: Turn[] = [...turns, { role: 'user', content: q }];
    setTurns(next);
    setBusy(true);
    const history: AssistantMessage[] = next.map((t) => ({ role: t.role, content: t.content }));
    const res = await askAssistant(history);
    setTurns((prev) => [
      ...prev,
      { role: 'assistant', content: res.reply, suggested: res.suggestedProperties },
    ]);
    setBusy(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI concierge"
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#0a0a0f] shadow-glow transition-transform hover:scale-105 ring-focus"
      >
        <span className="absolute h-14 w-14 animate-pulse-ring rounded-full bg-accent/40" />
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 00-9 9c0 1.6.4 3 1.2 4.3L3 21l4.9-1.2A9 9 0 1012 3z" />
            <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-5 z-[60] flex h-[560px] max-h-[78vh] w-[min(92vw,400px)] flex-col overflow-hidden rounded-2xl glass shadow-glass"
          >
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2l2.4 5.6L20 9l-4.5 3.8L17 19l-5-3-5 3 1.5-6.2L4 9l5.6-1.4z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold">Grovyn Concierge</p>
                <p className="text-xs text-success">● Online · AI-powered</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {turns.map((t, i) => (
                <div key={i}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      t.role === 'user'
                        ? 'ml-auto bg-accent text-[#0a0a0f]'
                        : 'bg-white/5 text-text'
                    }`}
                  >
                    {t.content}
                  </div>
                  {t.suggested && t.suggested.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {t.suggested.map((p) => (
                        <Link
                          key={p._id}
                          href={`/properties/${p.slug}`}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:border-accent/40"
                        >
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{p.title}</p>
                            <p className="truncate text-xs text-muted">
                              {p.location.city} · {priceLabel(p)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex gap-1 rounded-2xl bg-white/5 px-3.5 py-3 w-16">
                  <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                </div>
              )}
              {turns.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-text"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? 'Listening…' : 'Ask the concierge…'}
                className="flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:ring-1 focus:ring-accent"
              />
              {supported && (
                <button
                  type="button"
                  onClick={start}
                  aria-label="Voice input"
                  className={`flex h-10 w-10 items-center justify-center rounded-full ring-focus ${
                    listening ? 'bg-danger text-white' : 'bg-white/5 text-muted hover:text-text'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" />
                    <path d="M5 11a7 7 0 0014 0M12 18v3" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[#0a0a0f] disabled:opacity-40 ring-focus"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="h-2 w-2 rounded-full bg-muted"
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 0.8, delay }}
    />
  );
}

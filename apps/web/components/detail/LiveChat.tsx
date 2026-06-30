'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/store/auth';
import type { ChatMessage } from '@/types';

function isDuplicate(existing: ChatMessage[], incoming: ChatMessage): boolean {
  return existing.some((m) => {
    if (m._id && incoming._id) return m._id === incoming._id;
    const sameSender =
      m.sender.id && incoming.sender.id
        ? m.sender.id === incoming.sender.id
        : m.sender.name === incoming.sender.name;
    const closeInTime =
      Math.abs(+new Date(m.createdAt) - +new Date(incoming.createdAt)) < 5000;
    return sameSender && m.text === incoming.text && closeInTime;
  });
}

export function LiveChat({ roomId, agentName }: { roomId: string; agentName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [online, setOnline] = useState(false);
  const user = useAuth((s) => s.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const name = user?.name ?? 'Guest';

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('room:join', { roomId, user: { id: user?._id, name, role: user?.role ?? 'user' } });

    const onHistory = (d: { messages: ChatMessage[] }) => setMessages(d.messages ?? []);
    const onNew = (d: { message: ChatMessage }) =>
      setMessages((m) => (isDuplicate(m, d.message) ? m : [...m, d.message]));
    const onConnect = () => setOnline(true);
    const onDisconnect = () => setOnline(false);

    socket.on('chat:history', onHistory);
    socket.on('chat:new', onNew);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setOnline(socket.connected);

    return () => {
      socket.off('chat:history', onHistory);
      socket.off('chat:new', onNew);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [roomId, name, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    const clientId = crypto.randomUUID();
    const msg: ChatMessage = {
      _id: clientId,
      roomId,
      sender: { id: user?._id, name, role: user?.role ?? 'user' },
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, msg]);
    socket?.emit('chat:send', { roomId, text: text.trim(), clientId });
    setText('');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left ring-focus"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-success' : 'bg-muted'}`} />
          Live chat with {agentName.split(' ')[0]}
        </span>
        <span className={`text-accent transition-transform ${open ? 'rotate-180' : ''}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="border-t border-white/10">
          <div ref={scrollRef} className="max-h-64 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-center text-xs text-muted">
                Say hello — {agentName} typically replies in a few minutes.
              </p>
            )}
            {messages.map((m, i) => {
              const mine = user?._id ? m.sender.id === user._id : m.sender.name === name;
              return (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    mine ? 'ml-auto bg-accent text-[#0a0a0f]' : 'bg-white/5 text-text'
                  }`}
                >
                  {!mine && <span className="mb-0.5 block text-[10px] font-medium text-muted">{m.sender.name}</span>}
                  {m.text}
                </div>
              );
            })}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full bg-bg px-4 py-2 text-sm text-text outline-none placeholder:text-muted focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0f] ring-focus"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

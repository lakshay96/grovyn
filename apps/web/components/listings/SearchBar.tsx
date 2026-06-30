'use client';

import { useEffect, useRef, useState } from 'react';
import { getSuggestions, getTrending } from '@/lib/api';
import { useVoiceInput } from '@/lib/useVoice';

export function SearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const { supported, listening, start, transcript } = useVoiceInput();
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    getTrending().then(setTrending);
  }, []);

  useEffect(() => {
    if (transcript) {
      onChange(transcript);
      onSubmit(transcript);
    }
  }, [transcript, onChange, onSubmit]);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    debounce.current = setTimeout(() => {
      getSuggestions(value).then(setSuggestions);
    }, 250);
    return () => clearTimeout(debounce.current);
  }, [value]);

  const showPanel = focused && (suggestions.length > 0 || trending.length > 0);

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/70 px-4 py-3 backdrop-blur focus-within:border-accent/50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={listening ? 'Listening…' : 'Search city, type, amenity…'}
          aria-label="Search properties"
          className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />
        {supported && (
          <button
            type="button"
            onClick={start}
            aria-label="Voice search"
            className={`flex h-9 w-9 items-center justify-center rounded-full ring-focus ${
              listening ? 'animate-pulse bg-danger text-white' : 'text-muted hover:text-text'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" />
              <path d="M5 11a7 7 0 0014 0M12 18v3" />
            </svg>
          </button>
        )}
      </form>

      {showPanel && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-surface/95 p-2 shadow-glass backdrop-blur">
          {suggestions.length > 0 && (
            <div className="mb-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => {
                    onChange(s);
                    onSubmit(s);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-white/5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4-4" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          )}
          {trending.length > 0 && (
            <div className="px-3 py-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Trending</p>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onMouseDown={() => {
                      onChange(t);
                      onSubmit(t);
                    }}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-text"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

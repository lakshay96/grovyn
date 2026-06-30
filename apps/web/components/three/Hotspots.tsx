'use client';

import { Html } from '@react-three/drei';

export interface Annotation {
  id: string;
  position: [number, number, number];
  label: string;
  detail?: string;
}

export function Hotspots({
  annotations,
  active,
  onSelect,
}: {
  annotations: Annotation[];
  active: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {annotations.map((a) => (
        <Html key={a.id} position={a.position} center distanceFactor={10} zIndexRange={[10, 0]}>
          <button
            onClick={() => onSelect(a.id)}
            className="group relative flex items-center"
            aria-label={a.label}
          >
            <span className="absolute h-7 w-7 animate-pulse-ring rounded-full bg-accent/60" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full border border-white bg-accent text-[10px] font-bold text-[#0a0a0f]">
              +
            </span>
            {active === a.id && (
              <span className="ml-2 whitespace-nowrap rounded-lg border border-white/15 bg-bg/90 px-2.5 py-1.5 text-left text-xs text-text shadow-glass backdrop-blur">
                <strong className="block text-accent">{a.label}</strong>
                {a.detail && <span className="text-muted">{a.detail}</span>}
              </span>
            )}
          </button>
        </Html>
      ))}
    </>
  );
}

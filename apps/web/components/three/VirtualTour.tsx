'use client';

import { Component, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import { BackSide } from 'three';
import type { Property } from '@/types';

function PanoSphere({ url }: { url: string }) {
  const texture = useTexture(url);
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 60, 40]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
}

class PanoBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function SkyDome() {
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 40, 40]} />
      <meshBasicMaterial side={BackSide} color="#1c1c28" />
    </mesh>
  );
}

function TourHotspot({
  yaw,
  pitch,
  label,
  onClick,
}: {
  yaw: number;
  pitch: number;
  label: string;
  onClick: () => void;
}) {
  const r = 6;
  const x = r * Math.cos(pitch) * Math.sin(yaw);
  const y = r * Math.sin(pitch);
  const z = r * Math.cos(pitch) * Math.cos(yaw);
  return (
    <Html position={[x, y, z]} center distanceFactor={8}>
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-bg/80 px-3 py-1.5 text-xs font-medium text-text backdrop-blur transition-transform hover:scale-105 ring-focus"
      >
        <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
        {label}
      </button>
    </Html>
  );
}

export default function VirtualTour({ property }: { property: Property }) {
  const [stop, setStop] = useState(0);
  const panos = property.panoramaUrls ?? [];
  const hasPano = panos.length > 0;
  const current = panos[stop];

  useEffect(() => {
    if (stop >= panos.length) setStop(0);
  }, [panos.length, stop]);

  const hotspots = (property.tourHotspots ?? []).filter((h) => h.panoramaIndex === stop);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-bg md:h-[520px]">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} dpr={[1, 1.5]}>
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-lg bg-bg/80 px-3 py-2 text-xs text-muted">Loading 360° tour…</div>
            </Html>
          }
        >
          {hasPano && current ? (
            <PanoBoundary key={current} fallback={<SkyDome />}>
              <PanoSphere url={current} />
            </PanoBoundary>
          ) : (
            <SkyDome />
          )}
          {hotspots.map((h, i) => (
            <TourHotspot
              key={i}
              yaw={h.yaw}
              pitch={h.pitch}
              label={h.label}
              onClick={() => h.target != null && setStop(h.target)}
            />
          ))}
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
          dampingFactor={0.1}
          enableDamping
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-bg/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
          {hasPano ? `Stop ${stop + 1} / ${panos.length}` : '360° preview (sky dome)'}
        </span>
        <span className="rounded-full bg-bg/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
          Drag to look around
        </span>
      </div>

      {panos.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4">
          {panos.map((_, i) => (
            <button
              key={i}
              onClick={() => setStop(i)}
              aria-label={`Go to stop ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === stop ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

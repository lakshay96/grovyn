'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Interactive } from '@react-three/xr';
import { Environment } from '@react-three/drei';
import type { Group } from 'three';
import type { Property, Room } from '@/types';
import { ProceduralHouse } from './ProceduralHouse';
import { logEvent } from '@/lib/api';

const DEFAULT_AR_ROOMS: Room[] = [
  { name: 'Living', w: 4, d: 3.5, x: 0, z: 0 },
  { name: 'Kitchen', w: 2.5, d: 2.5, x: 3, z: -1.5 },
  { name: 'Bed', w: 3, d: 3, x: -3, z: -1.5 },
];

function ARModel({ scale, rooms }: { scale: number; rooms: Room[] }) {
  const ref = useRef<Group>(null);
  return (
    <group ref={ref} scale={scale} position={[0, 0, -1.5]}>
      <ProceduralHouse rooms={rooms} exploded={false} />
    </group>
  );
}

export default function ARViewer({ property }: { property: Property }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [scale, setScale] = useState(0.12);
  const [placed, setPlaced] = useState(false);
  const rooms = property.rooms?.length ? property.rooms : DEFAULT_AR_ROOMS;

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as Navigator & { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } };
    if (nav.xr?.isSessionSupported) {
      nav.xr
        .isSessionSupported('immersive-ar')
        .then((ok) => !cancelled && setSupported(ok))
        .catch(() => !cancelled && setSupported(false));
    } else {
      setSupported(false);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=14141C&color=C8A24B&data=${encodeURIComponent(
    shareUrl
  )}`;

  if (supported === false) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/50 p-6">
        <div className="grid items-center gap-6 md:grid-cols-[180px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="Scan to open in AR on your phone"
            width={180}
            height={180}
            className="mx-auto rounded-xl border border-white/10"
          />
          <div>
            <h4 className="text-lg font-semibold">AR isn’t available on this device</h4>
            <p className="mt-2 text-sm text-muted">
              Scan the code with your phone to place{' '}
              <span className="text-text">{property.title}</span> in your room.
              On iOS this opens an AR Quick Look-style view; on Android, Scene
              Viewer.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={shareUrl}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0f] ring-focus"
              >
                Open on mobile
              </a>
              {property.model3dUrl && (
                <a
                  href={property.model3dUrl}
                  rel="ar"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-text hover:bg-white/5 ring-focus"
                >
                  Quick Look / Scene Viewer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/50 p-4">
      <p className="mb-3 text-sm text-muted">
        Tap the button below to place a scaled model of{' '}
        <span className="text-text">{property.title}</span> in your physical space.
        Use the scale slider before launching.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-sm text-muted">
          Scale
          <input
            type="range"
            min={0.05}
            max={0.4}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="accent-[var(--accent)]"
          />
          <span className="w-10 text-text">{(scale * 100).toFixed(0)}%</span>
        </label>
        <button
          onClick={() => setPlaced(false)}
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-text hover:bg-white/5 ring-focus"
        >
          Reset placement
        </button>
      </div>

      <div className="overflow-hidden rounded-xl">
        <ARButton
          className="!relative !mb-3 !inline-block !rounded-full !bg-accent !px-5 !py-2.5 !text-sm !font-semibold !text-[#0a0a0f]"
          sessionInit={{ requiredFeatures: ['hit-test'] }}
          onClick={() => {
            logEvent('ar_launch', property._id);
            setPlaced(true);
          }}
        />
        <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-white/10 bg-bg">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1, 3], fov: 50 }}>
            <XR>
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 6, 3]} intensity={1.2} />
              <Suspense fallback={null}>
                <Interactive onSelect={() => setPlaced(true)}>
                  <ARModel scale={scale} rooms={rooms} />
                </Interactive>
                <Environment preset="apartment" />
              </Suspense>
            </XR>
          </Canvas>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-bg/70 px-3 py-1.5 text-[11px] text-muted backdrop-blur">
            {placed ? 'Model placed — tap to reposition in AR' : 'Preview · launch AR to place in your room'}
          </span>
        </div>
      </div>
    </div>
  );
}

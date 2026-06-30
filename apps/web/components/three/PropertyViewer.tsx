'use client';

import { Suspense, useMemo, useState, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Bounds,
  Html,
} from '@react-three/drei';
import type { Property, Room } from '@/types';
import { ProceduralHouse } from './ProceduralHouse';
import { GLBModel } from './GLBModel';
import { Hotspots, type Annotation } from './Hotspots';

const DEFAULT_ROOMS: Room[] = [
  { name: 'Living', w: 6, d: 5, x: 0, z: 0 },
  { name: 'Kitchen', w: 4, d: 3.5, x: 5, z: -3 },
  { name: 'Master', w: 5, d: 4.5, x: -5, z: -3 },
  { name: 'Bath', w: 2.5, d: 2.5, x: 5, z: 3 },
];

function GLBFallback() {
  return (
    <Html center>
      <div className="rounded-lg border border-white/10 bg-bg/80 px-3 py-2 text-xs text-muted">
        Loading model…
      </div>
    </Html>
  );
}

export default function PropertyViewer({ property }: { property: Property }) {
  const [exploded, setExploded] = useState(false);
  const [useModel, setUseModel] = useState(Boolean(property.model3dUrl));
  const [active, setActive] = useState<string | null>(null);
  const [modelFailed, setModelFailed] = useState(false);

  const rooms = property.rooms?.length ? property.rooms : DEFAULT_ROOMS;

  const annotations: Annotation[] = useMemo(
    () =>
      rooms.slice(0, 4).map((r, i) => ({
        id: `${r.name}-${i}`,
        position: [r.x, 2.9, r.z] as [number, number, number],
        label: r.name,
        detail: `${r.w}×${r.d}m · ${(r.w * r.d).toFixed(0)} m²`,
      })),
    [rooms]
  );

  const showModel = useModel && property.model3dUrl && !modelFailed;

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-surface to-bg md:h-[560px]">
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={40} />
        <color attach="background" args={['#0c0c12']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#fff4dd"
        />
        <pointLight position={[-8, 6, -6]} intensity={25} color="#6d6aff" />

        <Suspense fallback={<GLBFallback />}>
          <Bounds fit clip observe margin={1.2}>
            {showModel ? (
              <ErrorCatcher onError={() => setModelFailed(true)}>
                <GLBModel url={property.model3dUrl!} />
              </ErrorCatcher>
            ) : (
              <ProceduralHouse rooms={rooms} exploded={exploded} />
            )}
          </Bounds>
          {!showModel && (
            <Hotspots annotations={annotations} active={active} onSelect={setActive} />
          )}
          <Environment preset="apartment" />
          <ContactShadows position={[0, -0.05, 0]} opacity={0.5} scale={30} blur={2.4} far={8} />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={6}
          maxDistance={40}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {!showModel && (
            <button
              onClick={() => setExploded((v) => !v)}
              className="rounded-full border border-white/15 bg-bg/70 px-3 py-1.5 text-xs font-medium text-text backdrop-blur transition-colors hover:border-accent/50 ring-focus"
            >
              {exploded ? 'Collapse view' : 'Exploded view'}
            </button>
          )}
          {property.model3dUrl && !modelFailed && (
            <button
              onClick={() => setUseModel((v) => !v)}
              className="rounded-full border border-white/15 bg-bg/70 px-3 py-1.5 text-xs font-medium text-text backdrop-blur transition-colors hover:border-accent/50 ring-focus"
            >
              {useModel ? 'Floor-plan view' : 'Realistic model'}
            </button>
          )}
        </div>
        <span className="pointer-events-none rounded-full bg-bg/60 px-3 py-1.5 text-[11px] text-muted backdrop-blur">
          Drag to orbit · scroll to zoom
        </span>
      </div>
    </div>
  );
}

class ErrorCatcher extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

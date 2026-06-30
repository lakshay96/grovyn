'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  Float,
  PerspectiveCamera,
  AdaptiveDpr,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/useReducedMotion';

function Building({
  position,
  height,
  width = 1,
  depth = 1,
  accent = false,
}: {
  position: [number, number, number];
  height: number;
  width?: number;
  depth?: number;
  accent?: boolean;
}) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={accent ? '#1c1c28' : '#14141c'}
        metalness={0.7}
        roughness={0.25}
        emissive={accent ? '#6d6aff' : '#000000'}
        emissiveIntensity={accent ? 0.12 : 0}
      />
    </mesh>
  );
}

function HeroHouse() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.2, 2.2]} />
        <meshStandardMaterial color="#1c1c28" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 1.11]}>
        <planeGeometry args={[2.4, 1]} />
        <meshStandardMaterial
          color="#6d6aff"
          metalness={0.9}
          roughness={0.1}
          emissive="#6d6aff"
          emissiveIntensity={0.25}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.8, 0.18, 2.4]} />
        <meshStandardMaterial
          color="#c8a24b"
          metalness={0.85}
          roughness={0.2}
          emissive="#c8a24b"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[2.4, 0.04, 2]} />
        <meshStandardMaterial color="#36d399" emissive="#36d399" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function City({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  const buildings = useMemo(() => {
    const out: { pos: [number, number, number]; h: number; w: number; d: number; accent: boolean }[] = [];
    const rng = mulberry32(42);
    for (let i = 0; i < 26; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 3 + rng() * 5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      out.push({
        pos: [x, 0, z],
        h: 0.8 + rng() * 4,
        w: 0.5 + rng() * 0.8,
        d: 0.5 + rng() * 0.8,
        accent: rng() > 0.78,
      });
    }
    return out;
  }, []);

  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={group}>
      <Float speed={animate ? 1.4 : 0} rotationIntensity={0} floatIntensity={animate ? 0.5 : 0}>
        <HeroHouse />
      </Float>
      {buildings.map((b, i) => (
        <Building key={i} position={b.pos} height={b.h} width={b.w} depth={b.d} accent={b.accent} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#0c0c12" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function HeroScene() {
  const reduced = useReducedMotion();
  const animate = !reduced;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
    >
      <AdaptiveDpr pixelated />
      <PerspectiveCamera makeDefault position={[6, 4.5, 8]} fov={42} />
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 12, 26]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff4dd"
      />
      <pointLight position={[-6, 4, -4]} intensity={30} color="#6d6aff" />

      <Suspense fallback={null}>
        <City animate={animate} />
        <Environment preset="night" />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.55}
          scale={26}
          blur={2.6}
          far={6}
          resolution={512}
        />
      </Suspense>

      {!reduced && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.35} intensity={0.7} mipmapBlur radius={0.6} />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

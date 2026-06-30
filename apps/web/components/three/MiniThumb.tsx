'use client';

import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import type { Group } from 'three';
import { ProceduralHouse } from './ProceduralHouse';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { Room } from '@/types';

const DEFAULT: Room[] = [
  { name: 'Living', w: 5, d: 4, x: 0, z: 0 },
  { name: 'Kitchen', w: 3.5, d: 3, x: 4.5, z: -1 },
  { name: 'Bedroom', w: 4, d: 3.5, x: -4.5, z: -1 },
  { name: 'Bath', w: 2.5, d: 2.5, x: 4.5, z: 3 },
];

function Spin({ rooms }: { rooms: Room[] }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  useFrame((_, d) => {
    if (!reduced && ref.current) ref.current.rotation.y += d * 0.4;
  });
  return (
    <group ref={ref} scale={0.5} position={[0, -1, 0]}>
      <ProceduralHouse rooms={rooms} exploded={false} />
    </group>
  );
}

export default function MiniThumb({ rooms }: { rooms?: Room[] }) {
  return (
    <Canvas camera={{ position: [8, 7, 8], fov: 40 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#0c0c12']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <Spin rooms={rooms?.length ? rooms : DEFAULT} />
        <Environment preset="apartment" />
        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={16} blur={2.4} />
      </Suspense>
    </Canvas>
  );
}

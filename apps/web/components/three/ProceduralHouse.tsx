'use client';

import { useEffect, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Room } from '@/types';

const WALL = '#7b78ff';
const EDGE = '#c8a24b';

export function ProceduralHouse({
  rooms,
  exploded,
}: {
  rooms: Room[];
  exploded: boolean;
}) {
  const wallHeight = 2.6;

  const center = useMemo(() => {
    if (!rooms.length) return new THREE.Vector3();
    const xs = rooms.map((r) => r.x);
    const zs = rooms.map((r) => r.z);
    return new THREE.Vector3(
      (Math.min(...xs) + Math.max(...xs)) / 2,
      0,
      (Math.min(...zs) + Math.max(...zs)) / 2
    );
  }, [rooms]);

  const edgeGeometries = useMemo(
    () => rooms.map((r) => new THREE.BoxGeometry(r.w, wallHeight, r.d)),
    [rooms]
  );

  useEffect(() => () => edgeGeometries.forEach((g) => g.dispose()), [edgeGeometries]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center.x, -0.05, center.z]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#101018" metalness={0.3} roughness={0.8} />
      </mesh>

      {rooms.map((room, i) => {
        const lift = exploded ? (i % 3) * 1.4 + 0.6 : 0;
        const spread = exploded ? 1.35 : 1;
        const px = center.x + (room.x - center.x) * spread;
        const pz = center.z + (room.z - center.z) * spread;

        return (
          <group key={room.name} position={[px, lift, pz]}>
            <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[room.w, wallHeight, room.d]} />
              <meshStandardMaterial
                color={WALL}
                metalness={0.4}
                roughness={0.3}
                transparent
                opacity={0.14}
              />
            </mesh>
            <lineSegments position={[0, wallHeight / 2, 0]}>
              <edgesGeometry args={[edgeGeometries[i]]} />
              <lineBasicMaterial color={EDGE} />
            </lineSegments>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <planeGeometry args={[room.w, room.d]} />
              <meshStandardMaterial color={WALL} transparent opacity={0.12} metalness={0.5} roughness={0.6} />
            </mesh>
            <Text
              position={[0, wallHeight + 0.35, 0]}
              fontSize={0.35}
              color="#f5f5f7"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#0a0a0f"
            >
              {room.name}
            </Text>
            <Text
              position={[0, 0.12, room.d / 2 + 0.02]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.22}
              color="#9a9ab0"
              anchorX="center"
            >
              {`${room.w}×${room.d}m`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

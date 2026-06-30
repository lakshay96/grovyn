'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  Text,
  Html,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { getSocket } from '@/lib/socket';
import type { Property } from '@/types';

interface Peer {
  id: string;
  name: string;
  position: [number, number, number];
  rotationY: number;
}

function Avatar({ peer, self }: { peer: Peer; self?: boolean }) {
  return (
    <group position={peer.position} rotation={[0, peer.rotationY, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.9, 8, 16]} />
        <meshStandardMaterial
          color={self ? '#c8a24b' : '#6d6aff'}
          metalness={0.3}
          roughness={0.4}
          emissive={self ? '#c8a24b' : '#6d6aff'}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 0.9, 0.35]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={0.28} color="#f5f5f7" anchorX="center" outlineWidth={0.01} outlineColor="#0a0a0f">
        {self ? `${peer.name} (you)` : peer.name}
      </Text>
    </group>
  );
}

function HotspotPedestal({
  position,
  property,
}: {
  position: [number, number, number];
  property: Property;
}) {
  const [hover, setHover] = useState(false);
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 0.8, 24]} />
        <meshStandardMaterial color="#1c1c28" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh
        position={[0, 1.3, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
      >
        <boxGeometry args={[0.9, 0.9, 0.7]} />
        <meshStandardMaterial
          color="#c8a24b"
          metalness={0.7}
          roughness={0.25}
          emissive="#c8a24b"
          emissiveIntensity={hover ? 0.4 : 0.12}
        />
      </mesh>
      <Html position={[0, 2.1, 0]} center distanceFactor={12}>
        <a
          href={`/properties/${property.slug}`}
          className="whitespace-nowrap rounded-full border border-white/15 bg-bg/85 px-3 py-1.5 text-xs font-medium text-text backdrop-blur hover:border-accent/60"
        >
          {property.title}
        </a>
      </Html>
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#101018" metalness={0.4} roughness={0.7} />
      </mesh>
      <gridHelper args={[24, 24, '#2a2a3a', '#1a1a26']} position={[0, 0.01, 0]} />
      <mesh position={[0, 4, -12]} receiveShadow>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#14141c" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

function MovementRig({
  onMove,
  self,
}: {
  onMove: (pos: [number, number, number], rotY: number) => void;
  self: Peer;
}) {
  const { camera, gl } = useThree();
  const target = useRef(new THREE.Vector3(...self.position));

  const handlePointer = useCallback(
    (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      ray.ray.intersectPlane(plane, hit);
      if (hit) {
        hit.x = THREE.MathUtils.clamp(hit.x, -11, 11);
        hit.z = THREE.MathUtils.clamp(hit.z, -11, 11);
        target.current.copy(hit);
        const rotY = Math.atan2(hit.x - self.position[0], hit.z - self.position[2]);
        onMove([hit.x, 0, hit.z], rotY);
      }
    },
    [camera, gl, onMove, self.position]
  );

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener('pointerdown', handlePointer);
    return () => el.removeEventListener('pointerdown', handlePointer);
  }, [gl, handlePointer]);

  return null;
}

export default function Showroom({
  name,
  properties,
}: {
  name: string;
  properties: Property[];
}) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const selfId = useRef('local-' + Math.random().toString(36).slice(2, 8));
  const [self, setSelf] = useState<Peer>({
    id: selfId.current,
    name,
    position: [0, 0, 4],
    rotationY: 0,
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const roomId = 'showroom';
    socket.emit('room:join', { roomId, user: { id: selfId.current, name, role: 'user' } });

    const onState = (data: { peers: Peer[] }) => {
      setPeers(data.peers.filter((p) => p.id !== selfId.current));
    };
    const onLeave = (data: { id: string }) => {
      setPeers((prev) => prev.filter((p) => p.id !== data.id));
    };
    socket.on('presence:state', onState);
    socket.on('presence:leave', onLeave);

    return () => {
      socket.off('presence:state', onState);
      socket.off('presence:leave', onLeave);
    };
  }, [name]);

  const broadcast = useCallback(
    (position: [number, number, number], rotationY: number) => {
      setSelf((s) => ({ ...s, position, rotationY }));
      const socket = getSocket();
      socket?.emit('presence:move', { roomId: 'showroom', position, rotationY });
    },
    []
  );

  const hotspots = properties.slice(0, 4);
  const spots: [number, number, number][] = [
    [-6, 0, -6],
    [6, 0, -6],
    [-6, 0, 2],
    [6, 0, 2],
  ];

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-white/10 bg-bg">
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 9, 14]} fov={45} />
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 18, 36]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 12, 6]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-8, 6, 4]} intensity={20} color="#6d6aff" />

        <Suspense fallback={null}>
          <Room />
          {hotspots.map((p, i) => (
            <HotspotPedestal key={p._id} position={spots[i]} property={p} />
          ))}
          <Avatar peer={self} self />
          {peers.map((p) => (
            <Avatar key={p.id} peer={p} />
          ))}
          <Environment preset="warehouse" />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={28} blur={2.5} far={8} />
        </Suspense>

        <MovementRig self={self} onMove={broadcast} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-bg/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
          {peers.length + 1} visitor{peers.length === 0 ? '' : 's'} in room
        </span>
        <span className="rounded-full bg-bg/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
          Click the floor to teleport
        </span>
      </div>
    </div>
  );
}

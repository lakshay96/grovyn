'use client';

import { useGLTF } from '@react-three/drei';

export function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} dispose={null} scale={1} />;
}

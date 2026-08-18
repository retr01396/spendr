import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CardMesh: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: any) => {
    // Normalize mouse coordinates to [-1, 1]
    const rect = e.gl.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouse.current = { x, y };
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Floating idle sine motion
    meshRef.current.position.y = Math.sin(time * 1.5) * 0.15;

    // Smooth cursor-reactive rotation (max ±10deg)
    const targetRotX = mouse.current.y * 0.25;
    const targetRotY = mouse.current.x * 0.35;

    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.08;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.08;
  });

  return (
    <group ref={meshRef} onPointerMove={handlePointerMove}>
      {/* Metallic Card Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 2.0, 0.08]} />
        <meshStandardMaterial
          color="#121216"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Red Edge Rim Line */}
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[3.36, 1.96]} />
        <meshStandardMaterial
          color="#0A0A0C"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Flame Icon / Emblem on Card */}
      <mesh position={[-1.2, 0.5, 0.05]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#E50914" emissive="#E50914" emissiveIntensity={0.5} />
      </mesh>

      {/* Card Metallic Strip */}
      <mesh position={[0, -0.2, 0.05]}>
        <planeGeometry args={[3.2, 0.3]} />
        <meshStandardMaterial color="#1A1A22" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Subversive Red Rim Glow Accent */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.6, 2.2]} />
        <meshBasicMaterial color="#E50914" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

export const MetallicCard3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-48 relative rounded-xl overflow-hidden pointer-events-auto ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-3, -3, 2]} color="#E50914" intensity={2.5} />
        <CardMesh />
      </Canvas>
    </div>
  );
};

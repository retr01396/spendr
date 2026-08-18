import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

const CardMesh: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    groupRef.current.position.y = Math.sin(t * 1.5) * 0.18;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointerY * 0.4,
      0.08,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointerX * 0.55 + Math.sin(t * 0.8) * 0.2,
      0.08,
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 2.1, 0.18]} />
          <meshPhysicalMaterial
            color="#1a1d20"
            metalness={0.96}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={0.8}
            envMapIntensity={1.15}
          />
        </mesh>

        <mesh position={[0, 0, 0.095]}>
          <boxGeometry args={[3.12, 1.72, 0.04]} />
          <meshPhysicalMaterial
            color="#111417"
            metalness={0.9}
            roughness={0.42}
            clearcoat={0.8}
            clearcoatRoughness={0.35}
            envMapIntensity={1.2}
          />
        </mesh>

        <mesh position={[0, -0.28, 0.12]}>
          <planeGeometry args={[3.0, 0.26]} />
          <meshStandardMaterial color="#2a2d31" metalness={0.95} roughness={0.24} />
        </mesh>

        <mesh position={[-1.15, 0.42, 0.14]}>
          <boxGeometry args={[0.45, 0.45, 0.04]} />
          <meshStandardMaterial color="#e50914" emissive="#e50914" emissiveIntensity={0.7} />
        </mesh>

        <mesh position={[0, 0, -0.09]}>
          <planeGeometry args={[3.8, 2.35]} />
          <meshBasicMaterial color="#e50914" transparent opacity={0.12} />
        </mesh>

        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[3.35, 1.92]} />
          <meshBasicMaterial color="#ff4d4d" transparent opacity={0.07} />
        </mesh>
      </group>
    </Float>
  );
};

export const MetallicCard3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setIsWebGLAvailable(Boolean(gl));
  }, []);

  if (!isWebGLAvailable) {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-[28px] border border-[#FFFFFF1A] bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.18),rgba(15,16,18,0.88)_40%,rgba(4,5,6,1)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}>
        <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(229,9,20,0.12))]" />
        <div className="absolute left-6 top-6 h-16 w-16 rounded-2xl border border-[#E50914]/40 bg-[#101214] shadow-[0_0_18px_rgba(229,9,20,0.35)]" />
        <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-[#E50914]/35 bg-[#1a1d1f]" />
        <div className="absolute inset-x-8 bottom-7 h-12 rounded-xl border border-[#FFFFFF12] bg-[#0e1114]" />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[28px] border border-[#FFFFFF18] bg-[radial-gradient(circle_at_50%_30%,rgba(229,9,20,0.16),rgba(12,13,15,0.9)_38%,rgba(3,4,5,1)_100%)] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ${className}`}>
      <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(229,9,20,0.13))]" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#050507']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 4, 5]} intensity={1.65} color="#f5f7fb" />
          <directionalLight position={[-4, 2, 3]} intensity={1.4} color="#a0a6b2" />
          <pointLight position={[0, 0, 3]} intensity={18} color="#ff4d4d" distance={8} />
          <spotLight position={[-3, 3, 5]} angle={0.45} penumbra={1} intensity={20} color="#f7f7f7" />
          <CardMesh />
          <ContactShadows position={[0, -1.7, 0]} opacity={0.25} scale={7} blur={2.5} far={2.5} />
        </Canvas>
      </div>
    </div>
  );
};

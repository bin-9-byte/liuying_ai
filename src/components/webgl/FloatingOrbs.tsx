import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingOrbProps {
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
  phase?: number
}

function FloatingOrb({ position, color, scale = 1, speed = 1, phase = 0 }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const basePos = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed + phase
    meshRef.current.position.x = basePos.x + Math.sin(t * 0.7) * 0.8
    meshRef.current.position.y = basePos.y + Math.cos(t * 0.5) * 0.6
    meshRef.current.position.z = basePos.z + Math.sin(t * 0.3) * 0.4
    meshRef.current.rotation.x = t * 0.1
    meshRef.current.rotation.y = t * 0.15
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.15}
        wireframe={false}
      />
    </mesh>
  )
}

// 光晕光圈效果
function OrbHalo({ position, color, scale = 1 }: Omit<FloatingOrbProps, 'speed' | 'phase'>) {
  return (
    <mesh position={position} scale={scale * 1.4}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.04}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

export default function FloatingOrbs() {
  const orbs = [
    { position: [-8, 3, -5] as [number, number, number], color: '#7c3aed', scale: 3.5, speed: 0.4, phase: 0 },
    { position: [9, -2, -8] as [number, number, number], color: '#2563eb', scale: 4, speed: 0.3, phase: 2 },
    { position: [2, 6, -10] as [number, number, number], color: '#0891b2', scale: 2.8, speed: 0.5, phase: 4 },
    { position: [-12, -5, -6] as [number, number, number], color: '#9333ea', scale: 2, speed: 0.6, phase: 1 },
    { position: [14, 5, -12] as [number, number, number], color: '#4f46e5', scale: 3, speed: 0.35, phase: 3 },
  ]

  return (
    <>
      {orbs.map((orb, i) => (
        <group key={i}>
          <FloatingOrb {...orb} />
          <OrbHalo position={orb.position} color={orb.color} scale={orb.scale} />
        </group>
      ))}
      {/* 环境光 */}
      <ambientLight intensity={0.1} color="#7c3aed" />
      <pointLight position={[-8, 3, -5]} intensity={0.5} color="#7c3aed" distance={20} />
      <pointLight position={[9, -2, -8]} intensity={0.4} color="#2563eb" distance={20} />
    </>
  )
}

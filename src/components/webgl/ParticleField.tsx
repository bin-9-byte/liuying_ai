import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ── 粒子系统顶点着色器 ──
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2 uMouse;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // 时间驱动的浮动位移
    pos.x += sin(uTime * aSpeed + aPhase) * 0.8;
    pos.y += cos(uTime * aSpeed * 0.7 + aPhase * 1.3) * 0.6;
    pos.z += sin(uTime * aSpeed * 0.5 + aPhase * 0.8) * 0.4;
    
    // 鼠标排斥效果
    vec2 mouseInfluence = uMouse - pos.xy;
    float mouseDist = length(mouseInfluence);
    if (mouseDist < 4.0) {
      pos.xy -= normalize(mouseInfluence) * (4.0 - mouseDist) * 0.15;
    }
    
    // 深度感
    vAlpha = (pos.z + 10.0) / 20.0 * 0.6 + 0.1;
    
    // 颜色：紫-蓝-青 渐变
    float colorMix = fract(aPhase * 0.1 + uTime * 0.02);
    if (colorMix < 0.33) {
      vColor = mix(vec3(0.49, 0.23, 0.93), vec3(0.51, 0.33, 0.97), colorMix * 3.0);
    } else if (colorMix < 0.66) {
      vColor = mix(vec3(0.51, 0.33, 0.97), vec3(0.22, 0.74, 0.98), (colorMix - 0.33) * 3.0);
    } else {
      vColor = mix(vec3(0.22, 0.74, 0.98), vec3(0.49, 0.23, 0.93), (colorMix - 0.66) * 3.0);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
  }
`

// ── 粒子系统片元着色器 ──
const fragmentShader = /* glsl */`
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // 圆形粒子
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    
    // 发光边缘衰减
    float alpha = (0.5 - dist) * 2.0;
    alpha = pow(alpha, 1.5) * vAlpha;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`

const PARTICLE_COUNT = 1200

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef<[number, number]>([0, 0])
  const { gl } = useThree()

  // 生成粒子几何体
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      sizes[i] = Math.random() * 2.5 + 0.5
      speeds[i] = Math.random() * 0.4 + 0.1
      phases[i] = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  // 鼠标追踪
  useMemo(() => {
    const canvas = gl.domElement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      mouseRef.current = [x * 15, y * 10]
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = clock.getElapsedTime()
    mat.uniforms.uMouse.value.set(...mouseRef.current)
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}

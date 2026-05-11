'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface NodeData {
  position: [number, number, number]
  radius: number
  color: string
  connections: number[]
}

// ─── 색상 팔레트 ──────────────────────────────────────────────────────────────

const PALETTE = [
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f97316', // orange
  '#3b82f6', // blue
  '#f43f5e', // rose
  '#94a3b8', // slate
  '#a78bfa', // violet-light
  '#34d399', // emerald-light
  '#fb923c', // orange-light
  '#60a5fa', // blue-light
]

// ─── 노드 데이터 생성 ─────────────────────────────────────────────────────────

function generateNodes(count: number): NodeData[] {
  const nodes: NodeData[] = []

  for (let i = 0; i < count; i++) {
    // 구 표면 근처에 분포 (반지름 2~3 사이)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.8 + Math.random() * 1.2

    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    nodes.push({
      position: [x, y, z],
      radius: 0.08 + Math.random() * 0.07,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      connections: [],
    })
  }

  // 각 노드에 2~4개 연결
  for (let i = 0; i < nodes.length; i++) {
    const connectionCount = 2 + Math.floor(Math.random() * 3)
    const used = new Set<number>(nodes[i].connections)
    used.add(i)

    let attempts = 0
    while (nodes[i].connections.length < connectionCount && attempts < 50) {
      const j = Math.floor(Math.random() * nodes.length)
      if (!used.has(j)) {
        used.add(j)
        nodes[i].connections.push(j)
        // 양방향으로 추가 (중복 방지)
        if (!nodes[j].connections.includes(i)) {
          nodes[j].connections.push(i)
        }
      }
      attempts++
    }
  }

  return nodes
}

// ─── 엣지 라인 ───────────────────────────────────────────────────────────────

function Edges({ nodes }: { nodes: NodeData[] }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const visited = new Set<string>()

    for (let i = 0; i < nodes.length; i++) {
      for (const j of nodes[i].connections) {
        const key = [Math.min(i, j), Math.max(i, j)].join('-')
        if (visited.has(key)) continue
        visited.add(key)

        points.push(new THREE.Vector3(...nodes[i].position))
        points.push(new THREE.Vector3(...nodes[j].position))
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [nodes])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.18} />
    </lineSegments>
  )
}

// ─── 단일 노드 ────────────────────────────────────────────────────────────────

function Node({
  position,
  radius,
  color,
}: {
  position: [number, number, number]
  radius: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const target = hovered ? radius * 1.6 : radius
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, target / radius, delta * 8)
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  )
}

// ─── 그래프 씬 ────────────────────────────────────────────────────────────────

function GraphScene({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()

  const nodes = useMemo(() => generateNodes(22), [])

  useFrame((_, delta) => {
    if (!groupRef.current || !mouseRef.current) return

    // 자동 y축 회전
    groupRef.current.rotation.y += 0.0008

    // 마우스 parallax tilt
    const targetX = mouseRef.current.y * 0.2
    const targetY = mouseRef.current.x * 0.3 + groupRef.current.rotation.y

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      delta * 2
    )
    // y축은 자동 회전이 있으므로 lerp를 자동 회전에 더하는 방식 대신
    // 별도 오프셋으로 관리
  })

  // 마우스 오프셋을 분리 관리
  const mouseOffsetRef = useRef({ x: 0 })

  useFrame((_, delta) => {
    if (!groupRef.current || !mouseRef.current) return
    mouseOffsetRef.current.x = THREE.MathUtils.lerp(
      mouseOffsetRef.current.x,
      mouseRef.current.x * 0.3,
      delta * 2
    )
    // x 회전만 마우스로 조정, y는 자동 회전이 담당
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseRef.current.y * 0.2,
      delta * 2
    )
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#8b5cf6" />

      <Edges nodes={nodes} />

      {nodes.map((node, i) => (
        <Node
          key={i}
          position={node.position}
          radius={node.radius}
          color={node.color}
        />
      ))}
    </group>
  )
}

// ─── 히어로 텍스트 오버레이 ───────────────────────────────────────────────────

function HeroText() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* badge */}
      <motion.div
        variants={itemVariants}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm pointer-events-auto"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Interactive CS Visualizations
      </motion.div>

      {/* 타이틀 */}
      <motion.h1
        variants={itemVariants}
        className="font-mono text-5xl font-bold tracking-tight text-white sm:text-7xl drop-shadow-lg"
      >
        cs-canvas
      </motion.h1>

      {/* 서브타이틀 */}
      <motion.p
        variants={itemVariants}
        className="mt-5 text-center text-lg text-zinc-300 max-w-sm leading-relaxed drop-shadow-md"
      >
        Visualizing Computer Science,
        <br />
        one concept at a time.
      </motion.p>

      {/* CTA 버튼 */}
      <motion.a
        variants={itemVariants}
        href="#topics"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 text-sm text-white transition-colors backdrop-blur-sm pointer-events-auto"
      >
        Explore Topics
        <span className="text-base">↓</span>
      </motion.a>
    </motion.div>
  )
}

// ─── HeroGraph (export) ───────────────────────────────────────────────────────

export default function HeroGraph() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // -1 ~ 1 정규화
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative w-full h-screen">
      {/* Three.js Canvas */}
      <Canvas
        className="absolute inset-0"
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5.5], fov: 55 }}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <GraphScene mouseRef={mouseRef} />
      </Canvas>

      {/* 텍스트 오버레이 */}
      <HeroText />

      {/* 하단 스크롤 페이드 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </div>
  )
}

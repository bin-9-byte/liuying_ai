import React, { useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  SelectionMode,
  type Node,
  type Edge,
  type OnConnect,
  type NodeTypes,
  NodeResizer,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'

// ─── 图标组件 ───
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11 4L6 9L11 14" stroke="#0E0E0E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconUndo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 7.5C3 5 5 3 8 3C11 3 13 5 13 7.5C13 10 11 12 8 12H5" stroke="#0E0E0E" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.5 10L3 12L5.5 14" stroke="#0E0E0E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconRedo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 7.5C13 5 11 3 8 3C5 3 3 5 3 7.5C3 10 5 12 8 12H11" stroke="#0E0E0E" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 10L13 12L10.5 14" stroke="#0E0E0E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="3" r="1.5" stroke="#0E0E0E" strokeWidth="1.3" />
      <circle cx="12" cy="13" r="1.5" stroke="#0E0E0E" strokeWidth="1.3" />
      <circle cx="4" cy="8" r="1.5" stroke="#0E0E0E" strokeWidth="1.3" />
      <path d="M5.5 7.2L10.5 4M5.5 8.8L10.5 12" stroke="#0E0E0E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconText() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5H16M10 5V15M8 15H12" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconImage() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="#0E0E0E" strokeWidth="1.5" />
      <circle cx="7.5" cy="7.5" r="1.5" stroke="#0E0E0E" strokeWidth="1.3" />
      <path d="M3 13L7 9L10 12L13 9.5L17 13" stroke="#0E0E0E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconFrame() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="5" width="10" height="10" rx="1" stroke="#0E0E0E" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M5 2V5M15 2V5M5 15V18M15 15V18M2 5H5M2 15H5M15 5H18M15 15H18" stroke="#0E0E0E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconSticky() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4H13L16 7V16H4V4Z" stroke="#0E0E0E" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 4V7H16" stroke="#0E0E0E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9H13M7 12H11" stroke="#0E0E0E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconAI() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L11.5 7.5H16L12.5 10L14 14.5L10 12L6 14.5L7.5 10L4 7.5H8.5L10 3Z" stroke="#0E0E0E" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

// ─── 自定义文本节点 ───
function TextNode({ data, selected }: { data: { text: string }; selected: boolean }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(data.text || '双击编辑文字')

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      style={{
        minWidth: 120,
        minHeight: 40,
        padding: '8px 12px',
        background: 'transparent',
        border: selected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        borderRadius: 6,
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <NodeResizer minWidth={80} minHeight={32} isVisible={selected} handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3B82F6', border: 'none' }} lineStyle={{ border: 'none' }} />
      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={() => setEditing(false)}
          style={{
            all: 'unset',
            display: 'block',
            width: '100%',
            minHeight: 24,
            fontFamily: "'PingFang SC', sans-serif",
            fontSize: 16,
            color: '#0E0E0E',
            resize: 'none',
            outline: 'none',
          }}
        />
      ) : (
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: 16, color: '#0E0E0E', whiteSpace: 'pre-wrap', display: 'block' }}>
          {text}
        </span>
      )}
    </div>
  )
}

// ─── 自定义图片节点 ───
function ImageNode({ data, selected }: { data: { src?: string; label?: string }; selected: boolean }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: 120,
        minHeight: 80,
        border: selected ? '1.5px solid #3B82F6' : '1.5px solid #ECEDF0',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#F5F5F7',
        position: 'relative',
      }}
    >
      <NodeResizer minWidth={80} minHeight={60} isVisible={selected} handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3B82F6', border: 'none' }} lineStyle={{ border: 'none' }} />
      {data.src ? (
        <img src={data.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#878787' }}>
          <IconImage />
          <span style={{ fontSize: 12, fontFamily: "'PingFang SC', sans-serif" }}>拖入图片</span>
        </div>
      )}
    </div>
  )
}

// ─── 自定义便签节点 ───
const STICKY_COLORS = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD9', '#FFE0B2']
function StickyNode({ data, selected }: { data: { text: string; color?: string }; selected: boolean }) {
  const [text, setText] = useState(data.text || '')
  const [editing, setEditing] = useState(false)
  const bg = data.color || STICKY_COLORS[0]

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      style={{
        width: '100%',
        height: '100%',
        minWidth: 120,
        minHeight: 100,
        background: bg,
        border: selected ? '1.5px solid #3B82F6' : '1.5px solid transparent',
        borderRadius: 8,
        padding: 12,
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'relative',
      }}
    >
      <NodeResizer minWidth={100} minHeight={80} isVisible={selected} handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3B82F6', border: 'none' }} lineStyle={{ border: 'none' }} />
      {editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={() => setEditing(false)}
          style={{
            all: 'unset',
            display: 'block',
            width: '100%',
            height: '100%',
            fontFamily: "'PingFang SC', sans-serif",
            fontSize: 14,
            color: '#0E0E0E',
            resize: 'none',
            outline: 'none',
          }}
        />
      ) : (
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: 14, color: '#0E0E0E', whiteSpace: 'pre-wrap', display: 'block' }}>
          {text || '双击编辑便签...'}
        </span>
      )}
    </div>
  )
}

// ─── 自定义 Frame 节点 ───
function FrameNode({ data, selected }: { data: { label: string }; selected: boolean }) {
  const [label, setLabel] = useState(data.label || 'Frame')
  const [editingLabel, setEditingLabel] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: 200,
        minHeight: 150,
        border: selected ? '2px solid #3B82F6' : '2px dashed #CCCCCC',
        borderRadius: 8,
        background: 'rgba(245,245,247,0.5)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <NodeResizer minWidth={150} minHeight={100} isVisible={selected} handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#3B82F6', border: 'none' }} lineStyle={{ border: 'none' }} />
      {/* Frame 标题 */}
      <div style={{ position: 'absolute', top: -26, left: 0 }}>
        {editingLabel ? (
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            onBlur={() => setEditingLabel(false)}
            style={{ all: 'unset', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#878787', background: 'transparent', minWidth: 60 }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditingLabel(true)}
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#878787', cursor: 'default' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── 注册自定义节点类型 ───
const nodeTypes: NodeTypes = {
  textNode: TextNode as any,
  imageNode: ImageNode as any,
  stickyNode: StickyNode as any,
  frameNode: FrameNode as any,
}

// ─── 工具栏按钮 ───
function ToolBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const [showTip, setShowTip] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ background: '#F0F0F2' }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onClick={onClick}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: 'none',
          background: active ? '#F0F0F2' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {icon}
        <span style={{ fontSize: 10, fontFamily: "'Outfit', sans-serif", color: '#878787', lineHeight: 1 }}>{label}</span>
      </motion.button>
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: 'calc(100% + 6px)',
              transform: 'translateX(-50%)',
              background: '#1A1A1A',
              color: '#FFFFFF',
              fontSize: 11,
              fontFamily: "'PingFang SC', sans-serif",
              padding: '4px 8px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 999,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 初始欢迎节点 ───
const initialNodes: Node[] = [
  {
    id: 'welcome',
    type: 'textNode',
    position: { x: 400, y: 300 },
    data: { text: '✨ 开始创作吧\n从左侧工具条添加元素' },
    style: { width: 220, fontSize: 18, fontWeight: 500 },
  },
]
const initialEdges: Edge[] = []

// ─── 主画布页面 ───
export default function CanvasPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [projectName, setProjectName] = useState('未命名项目')
  const [editingName, setEditingName] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [saved, setSaved] = useState(true)

  // 禁用连线
  const onConnect: OnConnect = useCallback(() => {}, [])

  // 添加节点（点击工具后在画布中心添加）
  const addNode = useCallback(
    (type: string) => {
      const id = `node_${Date.now()}`
      const basePos = { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 }

      let newNode: Node
      switch (type) {
        case 'text':
          newNode = { id, type: 'textNode', position: basePos, data: { text: '新建文本' }, style: { width: 160 } }
          break
        case 'image':
          newNode = { id, type: 'imageNode', position: basePos, data: {}, style: { width: 240, height: 160 } }
          break
        case 'sticky':
          newNode = {
            id,
            type: 'stickyNode',
            position: basePos,
            data: { text: '', color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)] },
            style: { width: 160, height: 140 },
          }
          break
        case 'frame':
          newNode = { id, type: 'frameNode', position: basePos, data: { label: 'Frame' }, style: { width: 320, height: 240 } }
          break
        default:
          return
      }
      setNodes(ns => [...ns, newNode])
      setActiveTool(null)
      setSaved(false)
    },
    [setNodes]
  )

  const handleSave = () => {
    // TODO: 接入持久化
    setSaved(true)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: "'PingFang SC', sans-serif",
      }}
    >
      {/* ── 顶部工具栏 ── */}
      <header
        style={{
          height: 56,
          borderBottom: '1px solid #ECEDF0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          background: '#FFFFFF',
          zIndex: 20,
        }}
      >
        {/* 左侧：返回 + 项目名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.button
            whileHover={{ background: '#F5F5F7' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/home/projects')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconArrowLeft />
          </motion.button>

          {/* 项目名 */}
          {editingName ? (
            <input
              autoFocus
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              style={{
                all: 'unset',
                fontFamily: "'PingFang SC', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: '#0E0E0E',
                borderBottom: '1.5px solid #3B82F6',
                minWidth: 80,
                paddingBottom: 1,
              }}
            />
          ) : (
            <span
              onDoubleClick={() => setEditingName(true)}
              style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 500, fontSize: 15, color: '#0E0E0E', cursor: 'default' }}
            >
              {projectName}
            </span>
          )}

          {/* 保存状态 */}
          <span style={{ fontSize: 12, color: saved ? '#AAAAAA' : '#F59E0B', fontFamily: "'Outfit', sans-serif" }}>
            {saved ? '已保存' : '未保存'}
          </span>
        </div>

        {/* 中间：撤销/重做 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <motion.button
            whileHover={{ background: '#F5F5F7' }}
            whileTap={{ scale: 0.92 }}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <IconUndo />
          </motion.button>
          <motion.button
            whileHover={{ background: '#F5F5F7' }}
            whileTap={{ scale: 0.92 }}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <IconRedo />
          </motion.button>

          {/* 缩放显示 */}
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              border: '1px solid #ECEDF0',
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
              color: '#0E0E0E',
              marginLeft: 8,
              minWidth: 54,
              textAlign: 'center',
            }}
          >
            {zoom}%
          </div>
        </div>

        {/* 右侧：分享 + 保存按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.button
            whileHover={{ background: '#F5F5F7' }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 10,
              border: '1px solid #ECEDF0',
              background: 'transparent',
              fontFamily: "'PingFang SC', sans-serif",
              fontSize: 13,
              color: '#0E0E0E',
              cursor: 'pointer',
            }}
          >
            <IconShare />
            分享
          </motion.button>
          <motion.button
            whileHover={{ background: '#2A2A2A' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            style={{
              padding: '6px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#0E0E0E',
              fontFamily: "'PingFang SC', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            保存
          </motion.button>
        </div>
      </header>

      {/* ── 画布主体 ── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* 左侧工具条 */}
        <aside
          style={{
            width: 56,
            height: '100%',
            borderRight: '1px solid #ECEDF0',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 0',
            gap: 4,
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <ToolBtn icon={<IconText />} label="文本" active={activeTool === 'text'} onClick={() => addNode('text')} />
          <ToolBtn icon={<IconImage />} label="图片" active={activeTool === 'image'} onClick={() => addNode('image')} />
          <ToolBtn icon={<IconFrame />} label="Frame" active={activeTool === 'frame'} onClick={() => addNode('frame')} />
          <ToolBtn icon={<IconSticky />} label="便签" active={activeTool === 'sticky'} onClick={() => addNode('sticky')} />
          <div style={{ width: 32, height: 1, background: '#ECEDF0', margin: '4px 0' }} />
          <ToolBtn icon={<IconAI />} label="AI" active={activeTool === 'ai'} onClick={() => setActiveTool('ai')} />
        </aside>

        {/* React Flow 画布 */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            // 禁用连线交互
            nodesConnectable={false}
            edgesUpdatable={false}
            edgesFocusable={false}
            // 画布行为
            selectionMode={SelectionMode.Partial}
            panOnDrag={[1, 2]}  // 左键拖拽画布
            selectionOnDrag={true}
            selectNodesOnDrag={false}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.1}
            maxZoom={4}
            onMoveEnd={(_, vp) => setZoom(Math.round(vp.zoom * 100))}
            // 样式
            style={{ background: '#FAFAFA' }}
            deleteKeyCode={['Backspace', 'Delete']}
            proOptions={{ hideAttribution: false }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.2}
              color="#DDDDDD"
            />
            <MiniMap
              style={{
                border: '1px solid #ECEDF0',
                borderRadius: 10,
                background: '#FFFFFF',
              }}
              maskColor="rgba(0,0,0,0.04)"
              nodeColor="#CCCCCC"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

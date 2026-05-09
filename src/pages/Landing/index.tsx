import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TextType from '@/components/TextType'

// ─── 占位模版图片 ───
const TEMPLATE_IMAGES = [
  'https://picsum.photos/seed/t1/400/710',
  'https://picsum.photos/seed/t2/400/710',
  'https://picsum.photos/seed/t3/400/710',
  'https://picsum.photos/seed/t4/400/710',
  'https://picsum.photos/seed/t5/400/710',
  'https://picsum.photos/seed/t6/400/710',
  'https://picsum.photos/seed/t7/400/710',
  'https://picsum.photos/seed/t8/400/710',
  'https://picsum.photos/seed/t9/400/710',
  'https://picsum.photos/seed/t10/400/710',
]

// ─── 输入框最大高度常量（改一处即生效） ───
const INPUT_BOX_MAX_HEIGHT = 400  // 调整此值即可
const TEXTAREA_MAX_HEIGHT = INPUT_BOX_MAX_HEIGHT - 16 - 16 - 32 - 36 // 减去 padding上下 + gap + 底部行

// ─── 模型列表 ───
const MODEL_LIST = [
  { name: 'Gmini 3.1',  time: '20s',  icon: 'gemini' },
  { name: 'Nano Banana 2', time: '15s', icon: 'nano' },
  { name: 'GPT 1.5',   time: '120s', icon: 'gpt' },
]

// ─── 比例列表 ───
const FORMAT_LIST = ['16:9', '9:16', '3:4', '4:3']

// ─── 二级模版数据（横向卡片：标题 + 缩略图） ───
interface SubCard {
  title: string
  thumbnail: string   // 左侧主图
  prompt: string      // 模版提示词（选中后回填到输入框）
}
const TAG_SUB_TEMPLATES: Record<string, SubCard[]> = {
  '短视频模版': [
    { title: '产品展示',   thumbnail: 'https://picsum.photos/seed/sv1/130/83', prompt: '生成一个产品展示短视频，突出产品外观和核心功能' },
    { title: '品牌宣传',   thumbnail: 'https://picsum.photos/seed/sv2/130/83', prompt: '制作品牌宣传视频，展现品牌理念和视觉风格' },
    { title: '教程模版',   thumbnail: 'https://picsum.photos/seed/sv3/130/83', prompt: '创建操作教程视频，步骤清晰、画面简洁' },
    { title: '节日主题',   thumbnail: 'https://picsum.photos/seed/sv4/130/83', prompt: '设计节日主题短视频，充满节日氛围与创意' },
    { title: '美食探店',   thumbnail: 'https://picsum.photos/seed/sv5/130/83', prompt: '制作美食探店短视频，展现餐厅环境与菜品' },
    { title: '旅行Vlog',  thumbnail: 'https://picsum.photos/seed/sv6/130/83', prompt: '生成旅行Vlog，记录旅途风景与人文体验' },
  ],
  '直播间模版': [
    { title: '电商直播',   thumbnail: 'https://picsum.photos/seed/lv1/130/83', prompt: '搭建电商直播间背景，突出商品与促销信息' },
    { title: '游戏直播',   thumbnail: 'https://picsum.photos/seed/lv2/130/83', prompt: '设计游戏直播间场景，沉浸感强、界面清晰' },
    { title: '教学直播',   thumbnail: 'https://picsum.photos/seed/lv3/130/83', prompt: '创建教学直播间布局，板书区域与互动区分明' },
    { title: '活动直播',   thumbnail: 'https://picsum.photos/seed/lv4/130/83', prompt: '搭建活动直播场景，舞台感强、品牌露出清晰' },
  ],
  '图片': [
    { title: '社交媒体',   thumbnail: 'https://picsum.photos/seed/img1/130/83', prompt: '生成社交媒体配图，风格年轻活泼、视觉冲击力强' },
    { title: '海报设计',   thumbnail: 'https://picsum.photos/seed/img2/130/83', prompt: '设计活动海报，主题突出、排版层次分明' },
    { title: '名片模版',   thumbnail: 'https://picsum.photos/seed/img3/130/83', prompt: '创建个人名片，简洁专业、信息完整' },
    { title: 'PPT封面',   thumbnail: 'https://picsum.photos/seed/img4/130/83', prompt: '设计PPT封面，商务质感、标题醒目' },
  ],
  '视频': [
    { title: 'Vlog模版',   thumbnail: 'https://picsum.photos/seed/vid1/130/83', prompt: '生成Vlog模版，轻松自然的叙事节奏' },
    { title: 'MV模版',    thumbnail: 'https://picsum.photos/seed/vid2/130/83', prompt: '制作MV风格视频，画面节奏与音乐契合' },
    { title: '广告模版',   thumbnail: 'https://picsum.photos/seed/vid3/130/83', prompt: '创建广告短片模版，品牌植入自然、转化导向' },
    { title: '纪录片',    thumbnail: 'https://picsum.photos/seed/vid4/130/83', prompt: '设计纪录片模版，叙事沉稳、画面真实' },
  ],
}

// ─── 导航图标（使用本地 SVG 资源） ───
import iconHome from '@/assets/icons/导航icon/首页.svg'
import iconHomeActive from '@/assets/icons/导航icon/首页-active.svg'
import iconMaterials from '@/assets/icons/导航icon/素材库.svg'
import iconMaterialsActive from '@/assets/icons/导航icon/素材库-active.svg'
import iconProjects from '@/assets/icons/导航icon/项目.svg'
import iconProjectsActive from '@/assets/icons/导航icon/项目-active.svg'
import brandLogo from '@/assets/icons/品牌logo/logo.svg'
import avatarImg from '@/assets/icons/avatar/头像.png'
import iconThink from '@/assets/icons/avatar/Think.svg'
import iconLogout from '@/assets/icons/avatar/Logout.svg'
import tagShortVideo from '@/assets/icons/模版icon/短视频.svg'
import tagLiveStream from '@/assets/icons/模版icon/直播间.svg'
import tagImage from '@/assets/icons/模版icon/图片.svg'
import tagVideo from '@/assets/icons/模版icon/视频.svg'
import geminiIcon from '@/assets/icons/模版icon/gemini.png'
function IconSend({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4V16M6 8L10 4L14 8"
        stroke={active ? '#FFFFFF' : '#AAAAAA'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── 数据（使用本地 SVG 图标） ───
const NAV_ITEMS = [
  { label: '首页',  icon: iconHome,      iconActive: iconHomeActive },
  { label: '素材库', icon: iconMaterials,  iconActive: iconMaterialsActive },
  { label: '项目',  icon: iconProjects,   iconActive: iconProjectsActive },
]
// QUICK_TAGS 已替换为各自的 TagButton 组件
// const QUICK_TAGS = ['短视频模版', '直播间模版', '图片', '视频', '更多模板']

// ─── 快捷标签按钮（支持 active 状态） ───
function TagButton({ label, iconSrc, active, onClick }: { label: string; iconSrc?: string; active?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ borderColor: '#BBBBBB', backgroundColor: '#FAFAFA' }}
      whileTap={{ scale: 0.95 }}
      animate={{ borderColor: active ? '#0E0E0E' : '#ECEDF0', background: active ? '#F5F5F7' : '#FFFFFF' }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      style={{
        boxSizing: 'border-box',
        height: 44,
        padding: '11px 18px',
        border: '1px solid #ECEDF0',
        borderRadius: 16,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        flexShrink: 0,
        fontFamily: "'PingFang SC', sans-serif",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '22px',
        color: '#0E0E0E',
        whiteSpace: 'nowrap',
      }}
    >
      {iconSrc && <img src={iconSrc} alt={label} width={22} height={22} style={{ flexShrink: 0 }} />}
      {label}
    </motion.button>
  )
}

// ─── 左侧导航栏（独立组件，便于维护） ───
function Sidebar({
  activeNav,
  onNavChange,
}: {
  activeNav: number
  onNavChange: (i: number) => void
}) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const avatarRef = useRef<HTMLImageElement>(null)
  // 计算菜单定位（基于头像屏幕位置）
  const getMenuPosition = () => {
    if (!avatarRef.current) return { bottom: 48, left: 56 }
    const rect = avatarRef.current.getBoundingClientRect()
    return {
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
    }
  }
  return (
    <aside
      style={{
        /* Figma Frame 2147239702: w=88, padding=16, 竖排，固定在左侧 */
        width: 88,
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        boxSizing: 'border-box',
        borderRight: 'none',
        background: '#FFFFFF',
        zIndex: 10,
      }}
    >
      {/* 内部列：56px 宽，撑满高度，相对定位 */}
      <div
        style={{
          width: 56,
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', /* 只有导航项垂直居中 */
          alignItems: 'center',
        }}
      >
        {/* ── Logo：absolute 固定顶部，水平居中 ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img src={brandLogo} alt="logo" width={36} height={36} style={{ display: 'block' }} />
        </div>

        {/* ── 三个导航项：垂直居中（flex 自然居中） ── */}
        <div
          style={{
            width: 56,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive = activeNav === i
            return (
              <motion.button
                key={item.label}
                onClick={() => onNavChange(i)}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.12 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  padding: 0,
                }}
              >
                <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img
                    src={isActive ? item.iconActive : item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    style={{ display: 'block' }}
                  />
                </div>
                <span style={{ fontFamily: "'Outfit', 'PingFang SC', sans-serif", fontSize: 14, fontWeight: 400, lineHeight: '20px', color: isActive ? '#0E0E0E' : '#888888', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* ── 头像：absolute 固定底部，水平居中 ── */}
        <motion.img
          ref={avatarRef}
          src={avatarImg}
          alt="avatar"
          whileHover={{ opacity: 0.82 }}
          onClick={() => setShowAvatarMenu(v => !v)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
            display: 'block',
          }}
        />

        {/* ── 头像菜单 ── */}
        {showAvatarMenu && (
          <>
            {/* backdrop：点击外部关闭 */}
            <div
              onClick={() => setShowAvatarMenu(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                bottom: getMenuPosition().bottom,
                left: getMenuPosition().left,
                width: 260,
                background: '#FFFFFF',
                border: '1px solid #E3E4E8',
                boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 8,
                zIndex: 100,
              }}
            >
              {/* 个人信息区 */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: 12,
                  gap: 10,
                  background: '#FAFBFC',
                  borderRadius: 9,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 8 }}>
                  {/* 头像 40px */}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#303030', overflow: 'hidden' }}>
                    <img src={avatarImg} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                  </div>
                  {/* 名称 */}
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#1D2126', width: '100%' }}>
                    用户名
                  </span>
                  {/* 描述 */}
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#8A9199', width: '100%' }}>
                    kwai@kuaishou.com
                  </span>
                </div>
              </div>

              {/* 设置行 */}
              <motion.div
                whileHover={{ backgroundColor: '#EDEDED' }}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '5px 12px',
                  gap: 8,
                  height: 38,
                  borderRadius: 8,
                  background: '#FAFBFC',
                  cursor: 'pointer',
                }}
              >
                <img src={iconThink} alt="设置" style={{ width: 16, height: 16 }} />
                <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#323232', flex: 1 }}>
                  系统模式
                </span>
              </motion.div>

              {/* 分隔线 */}
              <div style={{ width: '100%', height: 1, background: '#FAFBFC' }} />

              {/* 退出登录行 */}
              <motion.div
                whileHover={{ backgroundColor: '#EDEDED' }}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '5px 12px',
                  gap: 8,
                  height: 38,
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <img src={iconLogout} alt="退出登录" style={{ width: 16, height: 16 }} />
                <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#E02C1F', flex: 1 }}>
                  退出登录
                </span>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </aside>
  )
}

// ─── 主页面 ───
export default function LandingPage() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [activeNav, setActiveNav] = useState(0)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeSubCard, setActiveSubCard] = useState<string | null>(null)
  // 胶囊附件列表（模版、图片、视频）
  const [attachments, setAttachments] = useState<Array<{ id: string; type: string; thumbnail: string; name: string }>>([])
  // contentEditable 输入区 ref
  const editorRef = useRef<HTMLDivElement>(null)
  // 用 ref 追踪纯文本（不含胶囊名），避免 state 异步问题
  const promptRef = useRef('')
  // 保存失焦前的光标 Range，供上传后恢复
  const savedRangeRef = useRef<Range | null>(null)

  // 从 contentEditable DOM 中提取纯用户文字（跳过胶囊 span）
  function extractUserText(el: HTMLElement): string {
    const parts: string[] = []
    function walk(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement
        // 跳过整个胶囊子树
        if (elem.hasAttribute('data-att-id')) return
        if (elem.tagName === 'BR') {
          parts.push('\n')
          return
        }
        // div/p 换行（contentEditable 用 div 包裹换行段落）
        if ((elem.tagName === 'DIV' || elem.tagName === 'P') && parts.length > 0) {
          parts.push('\n')
        }
        elem.childNodes.forEach(walk)
      } else if (node.nodeType === Node.TEXT_NODE) {
        parts.push(node.textContent || '')
      }
    }
    el.childNodes.forEach(walk)
    return parts.join('').replace(/\n{3,}/g, '\n\n').trimEnd()
  }

  // 构建单个胶囊 DOM span
  function buildCapsuleSpan(att: { id: string; thumbnail: string; name: string }): HTMLSpanElement {
    const span = document.createElement('span')
    span.setAttribute('contenteditable', 'false')
    span.setAttribute('data-att-id', att.id)
    span.style.cssText = `display:inline-flex;flex-direction:row;align-items:center;height:28px;padding:4px 8px;gap:4px;border-radius:8px;background:#FFFFFF;border:0.5px solid #ECEDF0;cursor:default;font-size:14px;font-family:'Outfit',sans-serif;white-space:nowrap;user-select:none;box-sizing:border-box;margin:0 4px 0 0;vertical-align:middle;`
    const img = document.createElement('img')
    img.src = att.thumbnail
    img.alt = ''
    img.style.cssText = `width:18px;height:18px;border-radius:4px;object-fit:cover;border:1px solid #FFFFFF;flex-shrink:0;`
    const nameSpan = document.createElement('span')
    nameSpan.style.cssText = `font-family:'Outfit',sans-serif;font-weight:400;font-size:14px;line-height:20px;color:#303030;`
    nameSpan.textContent = att.name
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '12')
    svg.setAttribute('height', '12')
    svg.setAttribute('viewBox', '0 0 12 12')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('data-close-att', att.id)
    svg.style.cssText = `cursor:pointer;flex-shrink:0;`
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M3 3L9 9M9 3L3 9')
    path.setAttribute('stroke', '#767676')
    path.setAttribute('stroke-width', '1.5')
    path.setAttribute('stroke-linecap', 'round')
    svg.appendChild(path)
    span.appendChild(img)
    span.appendChild(nameSpan)
    span.appendChild(svg)
    return span
  }

  // 在 contentEditable 光标处插入胶囊节点
  function insertCapsuleAtCursor(att: { id: string; thumbnail: string; name: string }) {
    const el = editorRef.current
    if (!el) return
    const capsule = buildCapsuleSpan(att)
    const space = document.createTextNode('\u00A0')

    // 优先使用保存的 range（editor 失焦时保存），其次用当前 selection
    const savedRange = savedRangeRef.current
    let range: Range | null = null
    if (savedRange && el.contains(savedRange.commonAncestorContainer)) {
      range = savedRange
    } else {
      el.focus()
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        range = sel.getRangeAt(0)
      }
    }

    if (range) {
      range.deleteContents()
      // 如果光标紧贴文字后面，先插入一个空格作为间距
      const nodeBefore = range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer
        : range.startContainer.childNodes[range.startOffset - 1]
      const textBefore = nodeBefore?.nodeType === Node.TEXT_NODE
        ? (nodeBefore as Text).data.slice(0, range.startContainer === nodeBefore ? range.startOffset : undefined)
        : null
      if (textBefore && textBefore.trimEnd().length > 0) {
        const leadingSpace = document.createTextNode('\u00A0')
        range.insertNode(leadingSpace)
        range.setStartAfter(leadingSpace)
        range.collapse(true)
      }
      range.insertNode(space)
      range.insertNode(capsule)
      // 把光标移到 space 后
      range.setStartAfter(space)
      range.collapse(true)
      // 恢复选区
      el.focus()
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      savedRangeRef.current = range
    } else {
      // fallback：追加到末尾
      el.appendChild(capsule)
      el.appendChild(space)
    }
    // 自动增高
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  // 模版选中：重建整个 contentEditable 内容（保留用户文字）
  // 文件上传走 insertCapsuleAtCursor，不走这个 effect
  const rebuildEditorForTemplate = (atts: Array<{ id: string; type: string; thumbnail: string; name: string }>, userText: string) => {
    const el = editorRef.current
    if (!el) return
    el.innerHTML = ''
    atts.forEach(att => {
      const capsule = buildCapsuleSpan(att)
      const space = document.createTextNode('\u00A0')
      el.appendChild(capsule)
      el.appendChild(space)
    })
    if (userText) {
      // 把 \n 转为 <br>
      const textParts = userText.split('\n')
      textParts.forEach((part, i) => {
        el.appendChild(document.createTextNode(part))
        if (i < textParts.length - 1) el.appendChild(document.createElement('br'))
      })
    }
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }
  // 二级模版滚动容器 ref + 滚动位置 state
  const subScrollRef = useRef<HTMLDivElement>(null)
  const [subScrollLeft, setSubScrollLeft] = useState(0)

  // 切换 tag 时同步重置滚动位置
  const handleTagClick = (tag: string) => {
    setActiveTag(tag)
    setActiveSubCard(null)
    setAttachments([])
    promptRef.current = ''
    setPrompt('')
    if (editorRef.current) {
      editorRef.current.querySelectorAll('[data-att-id^="tpl-"]').forEach(el => el.remove())
    }
    setSubScrollLeft(0)
    if (subScrollRef.current) subScrollRef.current.scrollLeft = 0
  }
  const [format, setFormat] = useState('16:9')
  const [model, setModel] = useState('Gmini 3.1')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showFormatDropdown, setShowFormatDropdown] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [showMoreTemplateMenu, setShowMoreTemplateMenu] = useState(false)
  const moreTemplateBtnRef = useRef<HTMLDivElement>(null)
  // 拖拽上传状态
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)  // 防止子元素触发 dragLeave
  // 文件上传 input ref
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = () => {
    if (prompt.trim()) navigate('/studio')
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
        overflow: 'hidden',  /* 根容器自身不滚动 */
      }}
    >
      {/* 左侧导航 */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* 主内容区 */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',          /* 主内容区占满视口高度 */
          overflowY: 'auto',        /* 这里滚动，不是 body */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'clamp(240px, 12vw, 240px)',
          paddingLeft: 'clamp(24px, 6vw, 88px)',
          paddingRight: 'clamp(24px, 6vw, 88px)',
          paddingBottom: 48,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Hero 外层 Frame 2147238747：col，gap:24，align:center ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: 1352,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 0,
            gap: 24,          /* Figma gap:24 */
          }}
        >
          {/* Frame 2147238746：col，gap:48（标题 + 文本框） */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 0,
              gap: 48,
            }}
          >
            {/* Frame 2147239565：col，gap:12（只有标题，副标题可扩展） */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 0,
                gap: 12,
              }}
            >
              {/* 流影AI，灵感即画面：打字机动效 */}
              <TextType
                as="h1"
                text={["流影AI，灵感即画面"]}
                typingSpeed={120}
                initialDelay={300}
                showCursor={false}
                loop={false}
                style={{
                  margin: 0,
                  width: '100%',
                  fontFamily: "'PingFang SC', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  lineHeight: '50px',
                  textAlign: 'center',
                  color: '#0E0E0E',
                }}
              />
            </div>

            {/* 文本框：880×140，padding:16，gap:32，justify:space-between */}
            <div
              onDragEnter={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dragCounterRef.current++
                setIsDragging(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dragCounterRef.current--
                if (dragCounterRef.current === 0) setIsDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dragCounterRef.current = 0
                setIsDragging(false)
                const files = e.dataTransfer.files
                if (!files || files.length === 0) return
                Array.from(files).forEach(file => {
                  const url = URL.createObjectURL(file)
                  const isImage = file.type.startsWith('image/')
                  const isVideo = file.type.startsWith('video/')
                  if (!isImage && !isVideo) return
                  const att = { id: `${isImage ? 'img' : 'vid'}-${file.name}-${Date.now()}`, type: isImage ? 'image' : 'video', thumbnail: url, name: file.name }
                  setAttachments(prev => [...prev, att])
                  insertCapsuleAtCursor(att)
                })
              }}
              style={{
                position: 'relative',
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: 880,
                minHeight: 140,
              maxHeight: INPUT_BOX_MAX_HEIGHT,
                background: '#FFFFFF',
                border: '1px solid #EBEBEB',
                boxShadow: '0px 3px 10px rgba(0,0,0,0.05)',
                borderRadius: 24,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',  /* 工具栏吸附底部 */
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              {/* 顶部行：输入区 */}
              <div
                style={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0 4px 0 0',
                  gap: 3,
                  overflow: 'visible',
                }}
              >
                {/* 输入区：contentEditable div（空标签，内容由 DOM 操作管理） */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', padding: '4px 0', overflowY: 'auto', maxHeight: TEXTAREA_MAX_HEIGHT + 'px' }}>
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => {
                      const el = editorRef.current
                      if (!el) return
                      el.style.height = 'auto'
                      el.style.height = el.scrollHeight + 'px'
                      // 提取纯用户文字（排除胶囊 span）
                      const text = extractUserText(el)
                      promptRef.current = text
                      setPrompt(text)
                    }}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate()
                    }}
                    onBlur={() => {
                      // 失焦时保存光标位置，供上传后恢复
                      const sel = window.getSelection()
                      if (sel && sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0)
                        const el = editorRef.current
                        if (el && el.contains(range.commonAncestorContainer)) {
                          savedRangeRef.current = range.cloneRange()
                        }
                      }
                    }}
                    onClick={(e) => {
                      // 事件委托：处理胶囊关闭按钮
                      const target = e.target as HTMLElement
                      const closeBtn = target.closest('[data-close-att]')
                      if (closeBtn) {
                        e.preventDefault()
                        e.stopPropagation()
                        const attId = closeBtn.getAttribute('data-close-att')
                        if (attId) {
                          // 直接从 DOM 移除胶囊 span（不走 useEffect 重建）
                          const capsuleSpan = editorRef.current?.querySelector(`[data-att-id="${attId}"]`)
                          if (capsuleSpan) {
                            // 移除胶囊后面紧跟的空格节点
                            const next = capsuleSpan.nextSibling
                            if (next && next.nodeType === Node.TEXT_NODE && next.textContent === '\u00A0') {
                              next.parentNode?.removeChild(next)
                            }
                            capsuleSpan.parentNode?.removeChild(capsuleSpan)
                          }
                          setAttachments(prev => prev.filter(a => a.id !== attId))
                          if (attId.startsWith('tpl-')) setActiveSubCard(null)
                          // 更新高度
                          if (editorRef.current) {
                            editorRef.current.style.height = 'auto'
                            editorRef.current.style.height = editorRef.current.scrollHeight + 'px'
                          }
                        }
                      }
                    }}
                    data-placeholder="请输入设计创作需求"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      minHeight: 28,
                      fontFamily: "'PingFang SC', sans-serif",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: '28px',
                      color: '#0E0E0E',
                      background: 'transparent',
                      padding: 0,
                      wordBreak: 'break-word',
                    }}
                    className="landing-textarea"
                  />
                </div>
              </div>

              {/* 底部行：左侧工具 + 右侧发送按钮，space-between，h:36 */}
              <div
                style={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 0,
                  height: 36,
                }}
              >
                {/* 左侧工具组：gap:16，w:277 */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  {/* 加号：上传附件按钮 + 下拉菜单 */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ backgroundColor: '#F5F5F7' }}
                      onClick={() => setShowUploadMenu(v => !v)}
                      style={{
                        boxSizing: 'border-box',
                        width: 36, height: 36,
                        borderRadius: '50%',
                        border: '1px solid #EBEBEB',
                        background: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, padding: 1,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="6" y1="0" x2="6" y2="12" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
                        <line x1="0" y1="6" x2="12" y2="6" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.button>

                    {/* backdrop */}
                    {showUploadMenu && (
                      <div onClick={() => setShowUploadMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                    )}

                    {/* 上传菜单下拉 */}
                    {showUploadMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          bottom: 44,
                          left: 0,
                          width: 160,
                          background: '#FFFFFF',
                          border: '1px solid #ECEDF0',
                          boxShadow: '0px 8px 18px rgba(0,0,0,0.08)',
                          borderRadius: 16,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                          zIndex: 100,
                        }}
                      >
                        {/* 提示文本 */}
                        <span style={{
                          width: 56, height: 20,
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 400, fontSize: 14, lineHeight: '20px',
                          color: '#878787',
                          alignSelf: 'flex-start',
                        }}>
                          上传附件
                        </span>

                        {/* 上传图片 */}
                        <motion.div
                          whileHover={{ backgroundColor: '#F5F5F7' }}
                          onClick={() => {
                            setShowUploadMenu(false)
                            imageInputRef.current?.click()
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: 8,
                            gap: 10,
                            width: 128,
                            height: 36,
                            borderRadius: 8,
                            cursor: 'pointer',
                            alignSelf: 'stretch',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {/* 图片 icon */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <rect x="2" y="3" width="16" height="14" rx="2" stroke="#0E0E0E" strokeWidth="1.5" />
                              <circle cx="7" cy="8" r="2" fill="#0E0E0E" />
                              <path d="M2 14L7 9L10 12L13 9L18 14" stroke="#0E0E0E" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#000000' }}>
                              上传图片
                            </span>
                          </div>
                        </motion.div>

                        {/* 上传视频 */}
                        <motion.div
                          whileHover={{ backgroundColor: '#F5F5F7' }}
                          onClick={() => {
                            setShowUploadMenu(false)
                            videoInputRef.current?.click()
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 8,
                            gap: 4,
                            width: 128,
                            height: 36,
                            borderRadius: 8,
                            cursor: 'pointer',
                            alignSelf: 'stretch',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {/* 视频 icon */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <rect x="2" y="3" width="16" height="14" rx="2" stroke="#0E0E0E" strokeWidth="1.5" />
                              <polygon points="8,7 8,13 13,10" fill="#0E0E0E" />
                            </svg>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#000000' }}>
                              上传视频
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>

                  {/* 隐藏的文件 input */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return
                      Array.from(files).forEach(file => {
                        const url = URL.createObjectURL(file)
                        const att = { id: `img-${file.name}-${Date.now()}`, type: 'image', thumbnail: url, name: file.name }
                        setAttachments(prev => [...prev, att])
                        insertCapsuleAtCursor(att)
                      })
                      e.target.value = ''
                    }}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return
                      Array.from(files).forEach(file => {
                        const url = URL.createObjectURL(file)
                        const att = { id: `vid-${file.name}-${Date.now()}`, type: 'video', thumbnail: url, name: file.name }
                        setAttachments(prev => [...prev, att])
                        insertCapsuleAtCursor(att)
                      })
                      e.target.value = ''
                    }}
                  />

                  {/* 比例选择：按钮 + 下拉面板 */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ borderColor: '#BBBBBB' }}
                      onClick={() => setShowFormatDropdown(v => !v)}
                      style={{
                        boxSizing: 'border-box',
                        width: 74, height: 36,
                        padding: '6px 12px',
                        border: '1px solid #EBEBEB', borderRadius: 29,
                        background: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#2B2B2B', whiteSpace: 'nowrap' }}>
                        {format}
                      </span>
                      <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="8.5" height="5.5" viewBox="0 0 8.5 5.5" fill="none">
                          <path d="M1 1L4.25 4.5L7.5 1" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.button>

                    {/* 点击外部关闭 backdrop */}
                    {showFormatDropdown && (
                      <div
                        onClick={() => setShowFormatDropdown(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                      />
                    )}

                    {/* 比例下拉面板 */}
                    {showFormatDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          bottom: 44,
                          left: 0,
                          width: 208,
                          background: '#FFFFFF',
                          border: '1px solid #ECEDF0',
                          boxShadow: '0px 8px 18px rgba(0,0,0,0.08)',
                          borderRadius: 16,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                          zIndex: 100,
                        }}
                      >
                        {/* 提示文本 */}
                        <span style={{
                          width: 164, height: 28,
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 400, fontSize: 14, lineHeight: '20px',
                          color: '#878787',
                        }}>
                          选择比例
                        </span>

                        {/* 比例选项 */}
                        {FORMAT_LIST.map((f) => (
                          <motion.div
                            key={f}
                            whileHover={{ backgroundColor: '#F5F5F7' }}
                            onClick={() => {
                              setFormat(f)
                              setShowFormatDropdown(false)
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: '8px 12px',
                              gap: 8,
                              width: 176,
                              height: 36,
                              background: format === f ? '#F5F5F7' : 'transparent',
                              borderRadius: 8,
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: 152,
                              height: 20,
                              gap: 8,
                            }}>
                              {/* 比例文本 */}
                              <span style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 400, fontSize: 14, lineHeight: '20px',
                                color: format === f ? '#2B2B2B' : '#000000',
                                whiteSpace: 'nowrap',
                              }}>
                                {f}
                              </span>
                              {/* 选中对勾 */}
                              {format === f && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3 7.5L6 10.5L11 4.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Gemini 模型选择：按钮 + 下拉面板 */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ borderColor: '#BBBBBB' }}
                      onClick={() => setShowModelDropdown(v => !v)}
                      style={{
                        boxSizing: 'border-box',
                        height: 36,
                        padding: '6px 12px',
                        border: '1px solid #ECEDF0', borderRadius: 29,
                        background: '#FFFFFF',
                        display: 'flex', alignItems: 'center', gap: 4,
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      <img src={geminiIcon} alt="Gemini" width={16} height={17} style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#0E0E0E', whiteSpace: 'nowrap' }}>
                        {model}
                      </span>
                      <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="8.5" height="5.5" viewBox="0 0 8.5 5.5" fill="none">
                          <path d="M1 1L4.25 4.5L7.5 1" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.button>

                    {/* ── 点击外部关闭下拉的 backdrop ── */}
                    {showModelDropdown && (
                      <div
                        onClick={() => setShowModelDropdown(false)}
                        style={{
                          position: 'fixed',
                          inset: 0,
                          zIndex: 99,
                        }}
                      />
                    )}

                    {/* ── 模型下拉面板 ── */}
                    {showModelDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          bottom: 44,      /* 面板在按钮上方 */
                          left: 0,
                          width: 352,
                          background: '#FFFFFF',
                          border: '1px solid #E3E4E8',
                          boxShadow: '3px 3px 10px rgba(0,0,0,0.1)',
                          borderRadius: 16,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                          zIndex: 100,
                        }}
                      >
                        {/* 提示文本 */}
                        <span style={{
                          width: 320, height: 28,
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 400, fontSize: 14, lineHeight: '20px',
                          color: '#878787',
                        }}>
                          选择模型以开始创作
                        </span>

                        {/* 模型选项列表 */}
                        {MODEL_LIST.map((m) => (
                          <motion.div
                            key={m.name}
                            whileHover={{ backgroundColor: '#F5F5F7' }}
                            onClick={() => {
                              setModel(m.name)
                              setShowModelDropdown(false)
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: '8px 12px',
                              gap: 8,
                              width: 320,
                              height: 54,
                              background: model === m.name ? '#F5F5F7' : 'transparent',
                              borderRadius: 8,
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            {/* 模型信息行 */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: 296,
                              height: 38,
                              gap: 8,
                            }}>
                              {/* 左侧：图标 + 名称 + 时间 */}
                              <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                gap: 8,
                              }}>
                                {/* 模型图标（使用 Gemini 图标作为占位） */}
                                <div style={{
                                  width: 24, height: 24,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  <img src={geminiIcon} alt={m.name} width={16} height={17} />
                                </div>
                                {/* 名称 + 时间 */}
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  height: 38,
                                }}>
                                  <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 400, fontSize: 14, lineHeight: '20px',
                                    color: model === m.name ? '#2B2B2B' : '#000000',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {m.name}
                                  </span>
                                  <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 400, fontSize: 12, lineHeight: '18px',
                                    color: '#878787',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {m.time}
                                  </span>
                                </div>
                              </div>
                              {/* 右侧：选中对勾 */}
                              {model === m.name && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3 7.5L6 10.5L11 4.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* ── 选中分类标签（紧跟 Gemini，共享 gap:16） ── */}
                  {activeTag && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ borderColor: '#888888' }}
                      onClick={() => setActiveTag(null)}
                      style={{
                        boxSizing: 'border-box',
                        height: 36,
                        padding: '6px 12px',
                        border: '1px solid #0E0E0E',
                        borderRadius: 29,
                        background: '#F5F5F7',
                        display: 'flex', alignItems: 'center', gap: 4,
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      {/* 关闭 X */}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1L9 9M9 1L1 9" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontFamily: "'PingFang SC',sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#0E0E0E', whiteSpace: 'nowrap' }}>
                        {activeTag}
                      </span>
                    </motion.button>
                  )}
                </div>

                {/* 发送按钮：36×36，右侧，背景 #ECEDF0 → #0E0E0E */}
                <motion.button
                  onClick={handleGenerate}
                  whileHover={prompt.trim() ? { scale: 1.06 } : {}}
                  whileTap={prompt.trim() ? { scale: 0.94 } : {}}
                  animate={{ backgroundColor: prompt.trim() ? '#0E0E0E' : '#ECEDF0' }}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: 36, height: 36,
                    borderRadius: '50%', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: prompt.trim() ? 'pointer' : 'default',
                    flexShrink: 0, padding: 0,
                  }}
                >
                  <IconSend active={!!prompt.trim()} />
                </motion.button>
              </div>

              {/* ── 拖拽上传毛玻璃遮罩 ── */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '45px 126px 43px 127px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px dashed #878787',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    borderRadius: 24,
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    {/* Upload icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                      fontFamily: "'PingFang SC', sans-serif",
                      fontWeight: 400, fontSize: 14, lineHeight: '22px',
                      textAlign: 'center', color: '#000000',
                    }}>
                      在此处拖放文件以添加到聊天中
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* 快捷标签行：选中分类后隐藏 */}
          {!activeTag && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: 16, height: 44, overflow: 'hidden', flexShrink: 1 }}>
              <TagButton label="短视频模版" iconSrc={tagShortVideo} onClick={() => handleTagClick('短视频模版')} />
              <TagButton label="直播间模版" iconSrc={tagLiveStream} onClick={() => handleTagClick('直播间模版')} />
              <TagButton label="图片" iconSrc={tagImage} onClick={() => handleTagClick('图片')} />
              <TagButton label="视频" iconSrc={tagVideo} onClick={() => handleTagClick('视频')} />
              {/* 更多模版按钮 + 下拉菜单 */}
              <div ref={moreTemplateBtnRef} style={{ position: 'relative' }}>
                <TagButton label="更多模板" onClick={() => setShowMoreTemplateMenu(v => !v)} />
                {showMoreTemplateMenu && (() => {
                  const rect = moreTemplateBtnRef.current?.getBoundingClientRect()
                  const menuTop = rect ? rect.bottom + 8 : 'auto'
                  const menuLeft = rect ? rect.left : 0
                  return (
                  <>
                    {/* backdrop */}
                    <div onClick={() => setShowMoreTemplateMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                    <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'fixed',
                  top: menuTop,
                  left: menuLeft,
                  width: 260,
                  background: '#FFFFFF',
                  border: '1px solid #E3E4E8',
                  boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 8,
                  zIndex: 100,
                }}
              >
                {/* 战报喜报 */}
                <motion.div
                  whileHover={{ backgroundColor: '#F5F5F7' }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '8px 12px',
                    gap: 4,
                    height: 38,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  {/* wreath icon */}
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2C6 2 2 6 2 11C2 16 6 20 11 20C16 20 20 16 20 11C20 6 16 2 11 2Z" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 11L10 13L14 9" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#0E0E0E' }}>
                    战报喜报
                  </span>
                </motion.div>

                {/* 贴纸模版 + 建设中 */}
                <motion.div
                  whileHover={{ backgroundColor: '#F5F5F7' }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    height: 38,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {/* calendar icon */}
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="2" y="4" width="18" height="16" rx="2" stroke="#878787" strokeWidth="1.5"/>
                      <path d="M2 9H20" stroke="#878787" strokeWidth="1.5"/>
                      <path d="M7 2V6" stroke="#878787" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M15 2V6" stroke="#878787" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#A4A4A4' }}>
                      贴纸模版
                    </span>
                  </div>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#A4A4A4' }}>
                    建设中
                  </span>
                </motion.div>

                {/* 数字人模版 + 建设中 */}
                <motion.div
                  whileHover={{ backgroundColor: '#F5F5F7' }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    height: 38,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {/* agent icon */}
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="8" r="4" stroke="#878787" strokeWidth="1.5"/>
                      <path d="M4 20C4 16 7 13 11 13C15 13 18 16 18 20" stroke="#878787" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#A4A4A4' }}>
                      数字人模版
                    </span>
                  </div>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#A4A4A4' }}>
                    建设中
                  </span>
                </motion.div>

                {/* 分隔线 */}
                <div style={{ width: '100%', height: 1, background: '#FAFBFC' }} />

                {/* 探索更多模版 */}
                <motion.div
                  whileHover={{ backgroundColor: '#F5F5F7' }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    height: 38,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#0E0E0E' }}>
                      探索更多模版
                    </span>
                  </div>
                  {/* compass icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#0E0E0E" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L10 10M10 6L6 10" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            </>
          )
                })()}
              </div>
            </div>
          )}

          {/* ── 二级模版弹出面板 ── */}
          {activeTag && TAG_SUB_TEMPLATES[activeTag] && (() => {
            const subCards = TAG_SUB_TEMPLATES[activeTag]!
            const CARD_W = 206        // 卡片宽度
            const CARD_GAP = 8        // 卡片间距
            const needScroll = subCards.length > 4

            const scrollBy = (dir: 'left' | 'right') => {
              if (!subScrollRef.current) return
              // 每次滚 4 张：让当前半露的卡片成为下一屏起点
              const step = (CARD_W + CARD_GAP) * 4
              subScrollRef.current.scrollBy({
                left: dir === 'right' ? step : -step,
                behavior: 'smooth',
              })
            }

            // 是否已到达右端（留 1px 容差避免浮点误差）
            const atRightEnd = (() => {
              const el = subScrollRef.current
              if (!el) return false
              return Math.ceil(subScrollLeft) >= el.scrollWidth - el.clientWidth
            })()

            return (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 16,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  /* 宽度跟输入框对齐，但限制最大可见宽度为 4.5 张卡片 + 2 个箭头 */
                  width: '100%',
                  maxWidth: needScroll ? (32 + 8 + (CARD_W * 4.5 + CARD_GAP * 4) + 8 + 32) : undefined,
                  alignSelf: needScroll ? undefined : 'center',
                }}
              >
                {/* 左箭头：始终占位，到最左端时隐藏（保持布局稳定） */}
                {needScroll && (
                  <motion.button
                    whileHover={subScrollLeft > 0 ? { backgroundColor: '#F0F0F0' } : {}}
                    whileTap={subScrollLeft > 0 ? { scale: 0.92 } : {}}
                    onClick={() => subScrollLeft > 0 && scrollBy('left')}
                    style={{
                      flexShrink: 0,
                      width: 32, height: 32,
                      borderRadius: '50%',
                      border: '1px solid #E9E9E9',
                      background: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: subScrollLeft > 0 ? 'pointer' : 'default',
                      padding: 0,
                      /* 到最左端时视觉隐藏，但仍占据空间 */
                      visibility: subScrollLeft > 0 ? 'visible' : 'hidden',
                      pointerEvents: subScrollLeft > 0 ? 'auto' : 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8L10 13" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                )}

                {/* 卡片滚动容器（外层包裹用于渐变 mask） */}
                {(() => {
                  // 根据滚动位置决定左右渐变：在边界时该侧不渐变
                  const fadeW = 40  // 渐变宽度 px
                  const leftFade  = needScroll && subScrollLeft > 0
                  const rightFade = needScroll && !atRightEnd
                  const leftStop  = leftFade  ? `transparent 0%, black ${fadeW}px` : 'black 0%'
                  const rightStop = rightFade ? `black calc(100% - ${fadeW}px), transparent 100%` : 'black 100%'
                  const maskValue = `linear-gradient(to right, ${leftStop}, ${rightStop})`

                  return (
                    <div style={{
                      flex: 1,
                      /* padding 给 hover shadow 留空间，负 margin 抵消占位 */
                      paddingTop: 8,
                      paddingBottom: 8,
                      marginTop: -8,
                      marginBottom: -8,
                      /* overflow hidden 裁剪左右溢出，但上下靠 padding 撑开 */
                      overflowX: needScroll ? 'hidden' : 'visible',
                      overflowY: 'visible',
                      WebkitMaskImage: maskValue,
                      maskImage: maskValue,
                    }}>
                      <div
                        ref={subScrollRef}
                        onScroll={(e) => setSubScrollLeft(e.currentTarget.scrollLeft)}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: CARD_GAP,
                          flexWrap: needScroll ? 'nowrap' : 'wrap',
                          overflowX: needScroll ? 'scroll' : 'visible',
                          overflowY: 'visible',
                          justifyContent: needScroll ? 'flex-start' : 'center',
                          scrollbarWidth: 'none',
                          paddingTop: 8,
                          paddingBottom: 8,
                          marginTop: -8,
                          marginBottom: -8,
                        }}
                      >
                        {subCards.map((card, i) => (
                          <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.06 }}
                            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            onClick={() => {
                              setActiveSubCard(card.title)
                              promptRef.current = card.prompt
                              setPrompt(card.prompt)
                              const tplAtt = { id: `tpl-${card.title}`, type: 'template', thumbnail: card.thumbnail, name: card.title }
                              setAttachments(prev => {
                                const filtered = prev.filter(a => a.type !== 'template')
                                return [...filtered, tplAtt]
                              })
                              // 模版选中：直接重建编辑器内容
                              const fileAtts = attachments.filter(a => a.type !== 'template')
                              rebuildEditorForTemplate([...fileAtts, tplAtt], card.prompt)
                            }}
                            style={{
                              boxSizing: 'border-box',
                              width: CARD_W,
                              height: 84,
                              background: activeSubCard === card.title ? '#F5F5F7' : '#FFFFFF',
                              border: activeSubCard === card.title ? '1.5px solid #0E0E0E' : '1px solid #E9E9E9',
                              borderRadius: 16,
                              display: 'flex',
                              flexDirection: 'row-reverse',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              padding: '12px 16px 12px 16px',
                              gap: 8,
                              cursor: 'pointer',
                              flexShrink: 0,
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {/* 左侧缩略图区域 */}
                            <div
                              style={{
                                position: 'absolute',
                                left: 20, top: 0,
                                width: 110, height: 83,
                              }}
                            >
                              <img
                                src={card.thumbnail}
                                alt={card.title}
                                style={{
                                  position: 'absolute',
                                  width: 65, height: 113,
                                  left: 3, top: 7,
                                  borderRadius: 8,
                                  transform: 'rotate(-9.51deg)',
                                  filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.25))',
                                  objectFit: 'cover',
                                }}
                              />
                              <img
                                src={card.thumbnail}
                                alt=""
                                style={{
                                  position: 'absolute',
                                  width: 58, height: 103,
                                  left: 40, top: 18,
                                  borderRadius: 8,
                                  transform: 'rotate(5.88deg)',
                                  border: '0.4px solid #FFFFFF',
                                  filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.25))',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>

                            {/* 右侧标题 */}
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                gap: 8,
                                width: 56,
                                height: 20,
                                flexShrink: 0,
                                marginLeft: 'auto',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Outfit', sans-serif",
                                  fontWeight: 400,
                                  fontSize: 14,
                                  lineHeight: '20px',
                                  color: '#000000',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {card.title}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* 右箭头：始终占位，到最右端时隐藏（保持布局稳定） */}
                {needScroll && (
                  <motion.button
                    whileHover={!atRightEnd ? { backgroundColor: '#F0F0F0' } : {}}
                    whileTap={!atRightEnd ? { scale: 0.92 } : {}}
                    onClick={() => !atRightEnd && scrollBy('right')}
                    style={{
                      flexShrink: 0,
                      width: 32, height: 32,
                      borderRadius: '50%',
                      border: '1px solid #E9E9E9',
                      background: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: !atRightEnd ? 'pointer' : 'default',
                      padding: 0,
                      /* 到最右端时视觉隐藏，但仍占据空间 */
                      visibility: !atRightEnd ? 'visible' : 'hidden',
                      pointerEvents: !atRightEnd ? 'auto' : 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            )
          })()}
        </motion.div>

        {/* ── 模版推荐 ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            /* 卡片到页面左右边缘 32px；超宽屏时 maxWidth 1288（5×251+4×8≈1288） */
            width: 'calc(100% - 64px)',       /* 视口宽度减去两侧 32px */
            maxWidth: 1288,
            marginLeft: 'calc(32px - clamp(24px, 6vw, 88px))',
            marginRight: 'calc(32px - clamp(24px, 6vw, 88px))',
            marginTop: 144,
            paddingBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignSelf: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 500,
              lineHeight: '28px',
              color: '#0E0E0E',
              fontFamily: "'PingFang SC', sans-serif",
            }}
          >
            模版推荐
          </h2>

          {/* 卡片列表：固定卡片宽度 251px，数量自适应 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 251px)',
              justifyContent: 'space-between',
              gap: 8,
              width: '100%',
            }}
          >
            {TEMPLATE_IMAGES.map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate('/studio')}
                style={{
                  aspectRatio: '251 / 447',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: '#F0F0F0',
                }}
              >
                <img
                  src={src}
                  alt={`模版 ${i + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* contentEditable placeholder + textarea styles */}
      <style>{`
        .landing-textarea:empty:before {
          content: attr(data-placeholder);
          color: #A4A4A4;
          pointer-events: none;
        }
        .landing-textarea:focus { caret-color: #0E0E0E; }
      `}</style>
    </div>
  )
}

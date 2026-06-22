import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

const NAV_ITEMS = [
  { label: '首页', icon: iconHome, iconActive: iconHomeActive, path: '/home' },
  { label: '素材库', icon: iconMaterials, iconActive: iconMaterialsActive, path: '/home/materials' },
  { label: '项目', icon: iconProjects, iconActive: iconProjectsActive, path: '/home/projects' },
]

// ─── 模拟项目数据 ───
interface ProjectItem {
  id: string
  name: string
  date: string
  thumbnail?: string
}

const MOCK_PROJECTS: ProjectItem[] = [
  { id: 'p1', name: '图文模版-打字报', date: '2026.01.23', thumbnail: 'https://picsum.photos/seed/proj1/281/156' },
  { id: 'p2', name: '图文模版-打字报', date: '2026.01.23', thumbnail: 'https://picsum.photos/seed/proj2/281/156' },
  { id: 'p3', name: '产品展示', date: '2026.01.23', thumbnail: 'https://picsum.photos/seed/proj3/281/156' },
]

// ─── 搜索图标 ───
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="#878787" strokeWidth="1.5" />
      <path d="M10.5 10.5L13.5 13.5" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── 加号图标 ───
function IconPlus() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 7V21M7 14H21" stroke="#0E0E0E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── 侧边栏 ───
function Sidebar({
  activeNav,
  onNavChange,
}: {
  activeNav: number
  onNavChange: (i: number, path: string) => void
}) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const avatarRef = useRef<HTMLImageElement>(null)

  const getMenuPosition = () => {
    if (!avatarRef.current) return { bottom: 48, left: 56 }
    const rect = avatarRef.current.getBoundingClientRect()
    return { bottom: window.innerHeight - rect.top + 8, left: rect.left }
  }

  return (
    <aside
      style={{
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
        background: '#FFFFFF',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 56,
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img src={brandLogo} alt="logo" width={36} height={36} style={{ display: 'block' }} />
        </div>

        {/* 导航项 */}
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
                onClick={() => onNavChange(i, item.path)}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.12 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? '#F5F5F7' : 'transparent',
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

        {/* 头像 */}
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

        {/* 头像菜单 */}
        {showAvatarMenu && (
          <>
            <div onClick={() => setShowAvatarMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 12, gap: 10, background: '#FAFBFC', borderRadius: 9 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#303030', overflow: 'hidden' }}>
                    <img src={avatarImg} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#1D2126', width: '100%' }}>用户名</span>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#8A9199', width: '100%' }}>kwai@kuaishou.com</span>
                </div>
              </div>
              <motion.div whileHover={{ backgroundColor: '#EDEDED' }} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '5px 12px', gap: 8, height: 38, borderRadius: 8, background: '#FAFBFC', cursor: 'pointer' }}>
                <img src={iconThink} alt="设置" style={{ width: 16, height: 16 }} />
                <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#323232', flex: 1 }}>系统模式</span>
              </motion.div>
              <div style={{ width: '100%', height: 1, background: '#FAFBFC' }} />
              <motion.div whileHover={{ backgroundColor: '#EDEDED' }} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '5px 12px', gap: 8, height: 38, borderRadius: 8, cursor: 'pointer' }}>
                <img src={iconLogout} alt="退出登录" style={{ width: 16, height: 16 }} />
                <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '22px', color: '#E02C1F', flex: 1 }}>退出登录</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </aside>
  )
}

// ─── 新建项目卡片 ───
function NewProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ borderColor: '#CCCCCC', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      onClick={onClick}
      style={{
        boxSizing: 'border-box',
        width: 313,
        height: 240,
        background: '#FFFFFF',
        border: '1px solid #ECEDF0',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        cursor: 'pointer',
        flexGrow: 1,
        flexShrink: 0,
      }}
    >
      {/* 预览区 */}
      <div
        style={{
          width: '100%',
          flex: 1,
          background: '#F5F5F7',
          border: '1px solid #ECEDF0',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <IconPlus />
      </div>
      {/* 底部信息 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: '0 4px' }}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: '14px', color: '#0E0E0E', opacity: 0.8 }}>新建项目</span>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '14px', color: '#0E0E0E', opacity: 0.5 }}>2026.01.23</span>
      </div>
    </motion.div>
  )
}

// ─── 项目卡片 ───
function ProjectCard({ project, onOpen }: { project: ProjectItem; onOpen?: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ borderColor: '#CCCCCC', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        boxSizing: 'border-box',
        width: 313,
        height: 240,
        border: '1px solid #ECEDF0',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        cursor: 'pointer',
        flexGrow: 1,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* 预览图区 */}
      <div
        style={{
          width: '100%',
          flex: 1,
          border: '1px solid #ECEDF0',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
          isolation: 'isolate',
        }}
      >
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* hover 时显示的操作按钮 */}
        {hovered && (
          <>
            {/* 打开按钮（居中） */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onOpen}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                height: 40,
                background: 'rgba(46, 48, 56, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 12,
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              打开项目
            </motion.div>

            {/* 右上角操作按钮：删除 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                right: 7.75,
                top: 8,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(14, 14, 14, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 4.5H11.5M5.5 4.5V2.5H8.5V4.5M6 7V10.5M8 7V10.5M3.5 4.5L4 11.5H10L10.5 4.5H3.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            {/* 右上角操作按钮：更多 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                right: 43.75,
                top: 8,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(14, 14, 14, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="3" cy="7" r="1.2" fill="white" />
                <circle cx="7" cy="7" r="1.2" fill="white" />
                <circle cx="11" cy="7" r="1.2" fill="white" />
              </svg>
            </motion.div>
          </>
        )}
      </div>

      {/* 底部信息 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: '0 4px' }}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: '14px', color: '#0E0E0E', opacity: 0.8 }}>
          {project.name}
        </span>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '14px', color: '#0E0E0E', opacity: 0.5 }}>
          {project.date}
        </span>
      </div>
    </motion.div>
  )
}

// ─── 主页面 ───
export default function ProjectsPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(2) // 项目 active
  const [activeTab, setActiveTab] = useState(0) // 0=全部, 1=我创建的, 2=共享给我
  const [searchValue, setSearchValue] = useState('')

  const TABS = ['全部', '我创建的', '共享给我']

  const handleNavChange = (i: number, path: string) => {
    setActiveNav(i)
    navigate(path)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* 左侧导航 */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* 主内容区 */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
          background: '#FFFFFF',
          borderRadius: 24,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px 32px 0px',
            gap: 16,
            minHeight: '100%',
          }}
        >
          {/* 标题 */}
          <h1
            style={{
              fontFamily: "'PingFang SC', sans-serif",
              fontWeight: 500,
              fontSize: 28,
              lineHeight: '39px',
              color: '#0E0E0E',
              margin: 0,
            }}
          >
            我的项目
          </h1>

          {/* Tab 栏 + 搜索框 */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Tab 组件 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '8px 4px',
                gap: 24,
                height: 46,
              }}
            >
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: activeTab === i ? 4 : 2,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Outfit', 'PingFang SC', sans-serif",
                      fontWeight: activeTab === i ? 500 : 400,
                      fontSize: 16,
                      lineHeight: '24px',
                      color: activeTab === i ? '#0E0E0E' : '#878787',
                    }}
                  >
                    {tab}
                  </span>
                  {activeTab === i && (
                    <div
                      style={{
                        width: 12,
                        height: 2,
                        background: '#0E0E0E',
                        borderRadius: 4,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 5px 12px 12px',
                gap: 4,
                width: 230,
                height: 46,
                border: '1px solid #ECEDF0',
                borderRadius: 12,
              }}
            >
              <IconSearch />
              <input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="搜索项目"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: "'Outfit', 'PingFang SC', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#0E0E0E',
                }}
              />
            </div>
          </div>

          {/* 项目网格 */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              gap: 16,
            }}
          >
            {/* 新建项目卡片 */}
            <NewProjectCard onClick={() => navigate(`/home/canvas/${Date.now()}`)} />

            {/* 已有项目 */}
            {MOCK_PROJECTS.filter(p =>
              !searchValue || p.name.toLowerCase().includes(searchValue.toLowerCase())
            ).map(project => (
              <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/home/canvas/${project.id}`)} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

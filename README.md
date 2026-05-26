# 流影AI - 视觉创作平台

流影AI 是一个从创意到完整视觉系统的 AI 驱动设计平台。本项目是流影AI 的官网 Splash 页面，展示品牌理念与核心功能。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion + GSAP
- **3D 效果**: Three.js + React Three Fiber
- **状态管理**: Zustand
- **数据请求**: TanStack Query + Axios
- **路由**: React Router v7

## 项目结构

```
src/
├── components/
│   ├── layout/          # 布局组件
│   │   ├── SplashHeader.tsx    # 顶部导航栏（响应式主题切换）
│   │   ├── Navbar.tsx          # 主导航
│   │   └── AppLayout.tsx       # 应用布局
│   ├── webgl/           # WebGL 视觉组件
│   │   ├── Dither.tsx          # 动态 Dither 背景效果
│   │   ├── FloatingOrbs.tsx    # 浮动光球
│   │   └── ParticleField.tsx   # 粒子场
│   └── ui/              # UI 组件
├── pages/
│   ├── Splash/          # 官网首页（Landing Page）
│   │   ├── index.tsx           # 主入口
│   │   ├── Section1.tsx        # Hero 区域
│   │   ├── Section2.tsx        # 品牌介绍
│   │   ├── Section3ScrollEffect.tsx  # 滚动动效
│   │   ├── Section4.tsx        # 素材展示
│   │   ├── Section5v2.tsx      # 动态窗口展开
│   │   ├── Section6v2.tsx      # 功能特性
│   │   └── Section7.tsx        # Footer
│   ├── Landing/         # 产品主页面
│   └── Studio/          # 创作工作室
├── router/              # 路由配置
├── store/               # 全局状态
└── lib/                 # 工具函数
```

## 核心特性

### 1. 动态 Header 主题
顶部导航栏随滚动进度自动切换深色/浅色主题，与页面背景智能联动。

### 2. WebGL Dither 背景
使用 Three.js 实现的动态波纹 Dither 效果，支持鼠标交互和滚动衰减。

### 3. 滚动驱动动画
- Section3: 三行文字渐进显示，带弹簧阻尼效果的平滑跟随
- Section5v2: 动态窗口随滚动展开，背景从透明过渡到白色

### 4. 响应式设计
- Header 左右 padding 自适应：`clamp(24px, 15vw, 300px)`
- 移动端友好布局

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 开发规范

- **类型安全**: 使用 TypeScript 严格模式
- **代码风格**: ESLint + Prettier
- **组件设计**: 函数组件 + Hooks
- **样式方案**: Tailwind CSS 工具类优先

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private - 流影AI 内部项目

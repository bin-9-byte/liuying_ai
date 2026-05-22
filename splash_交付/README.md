# Splash 页面交付说明

## 文件结构

```
splash_交付/
├── pages/
│   └── Splash/
│       └── index.tsx          # Splash 主页面组件
├── components/
│   ├── layout/
│   │   └── SplashHeader.tsx   # 顶部 Header（Logo + 品牌名）
│   ├── webgl/
│   │   ├── Dither.jsx         # WebGL Dither 背景动画
│   │   └── Dither.d.ts        # Dither TypeScript 类型声明
│   └── common/
│       └── PageLoader.tsx     # 页面加载中占位组件（Suspense fallback）
└── router/
    └── index.tsx              # 路由配置（含 Splash 路由）
```

## 页面结构说明

```
SplashScreen（fixed 全屏，背景色 #08080f）
├── Dither（WebGL 波纹抖动背景，absolute inset-0）
├── SplashHeader（absolute 左上角，Logo SVG + "流影AI"）
└── 中间内容区（居中 flex-col）
    ├── 主标题：「灵感, 即画面」（text-6xl，#f0f0f5）
    ├── 副标题：「让好创意，更快被看见」（rgba(240,240,245,0.55)）
    └── 按钮：「即刻开始」（164×58px，白底黑字，圆角 rounded-3xl）
```

**交互逻辑**：点击「即刻开始」→ 页面 fade out（0.8s）→ 跳转 `/home`（Landing 页面）

## 路径别名

代码中使用了 `@/` 路径别名，对应项目 `src/` 目录，需在构建工具中配置：

**vite.config.ts**
```ts
import path from 'path'

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

**tsconfig.json（paths 部分）**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 必要 npm 依赖

将以下依赖添加到项目的 `package.json` 并安装：

```bash
npm install react react-dom react-router-dom framer-motion three @react-three/fiber
```

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.2.5 | React 核心 |
| `react-dom` | ^19.2.5 | React DOM 渲染 |
| `react-router-dom` | ^7.15.0 | 路由（`useNavigate`、`Navigate`、`createBrowserRouter`） |
| `framer-motion` | ^12.38.0 | 页面进出场动画、按钮 hover/tap 动效 |
| `three` | ^0.184.0 | WebGL 底层库（Dither 背景依赖） |
| `@react-three/fiber` | ^9.6.1 | React 的 Three.js 渲染器（Dither 背景依赖） |

> **Tailwind CSS**：页面使用了 Tailwind 工具类（如 `fixed inset-0`、`flex`、`text-6xl` 等），需确保项目已配置 Tailwind CSS v4。

## 文件集成方式

按照如下对应关系，将文件放置到目标项目的 `src/` 目录下：

```
splash_交付/pages/Splash/index.tsx        → src/pages/Splash/index.tsx
splash_交付/components/layout/SplashHeader.tsx → src/components/layout/SplashHeader.tsx
splash_交付/components/webgl/Dither.jsx   → src/components/webgl/Dither.jsx
splash_交付/components/webgl/Dither.d.ts  → src/components/webgl/Dither.d.ts
splash_交付/components/common/PageLoader.tsx → src/components/common/PageLoader.tsx
splash_交付/router/index.tsx              → src/router/index.tsx
```

然后在项目入口（通常为 `src/main.tsx`）引入路由：

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

访问根路径 `/` 会自动重定向到 `/splash`，展示 Splash 页面。

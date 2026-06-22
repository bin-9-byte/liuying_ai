import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import PageLoader from '@/components/common/PageLoader'

// 懒加载页面，减少首屏 bundle 体积
const SplashPage = lazy(() => import('@/pages/Splash'))
const LandingPage = lazy(() => import('@/pages/Landing'))
const StudioPage = lazy(() => import('@/pages/Studio'))
const ProjectsPage = lazy(() => import('@/pages/Projects'))
const CanvasPage = lazy(() => import('@/pages/Canvas'))

export const router = createBrowserRouter([
  {
    // 首次访问根路径，跳到开屏
    path: '/',
    element: <Navigate to="/splash" replace />,
  },
  {
    path: '/splash',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SplashPage />
      </Suspense>
    ),
  },
  {
    path: '/home',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: 'studio',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StudioPage />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'canvas/:id?',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CanvasPage />
          </Suspense>
        ),
      },
    ],
  },
])

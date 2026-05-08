import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import PageLoader from '@/components/common/PageLoader'

// 懒加载页面，减少首屏 bundle 体积
const LandingPage = lazy(() => import('@/pages/Landing'))
const StudioPage = lazy(() => import('@/pages/Studio'))

export const router = createBrowserRouter([
  {
    path: '/',
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
    ],
  },
])

import { useScroll, useTransform, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// ── 从 Figma 量出的比例系数 ──────────────────────────────────────
// 原图尺寸：4900 × 2944
// 视觉窗口：宽 1481，高 1926，左上角 x=1705, y=555
const WIN_W_RATIO = 1481 / 4900;   // 窗口宽 / 原图宽 ≈ 0.3022
const WIN_H_RATIO = 1926 / 2944;   // 窗口高 / 原图高 ≈ 0.6542
// 窗口中心相对原图中心的偏移比例（原图中心 = 2450, 1472）
// 窗口中心 = (1705 + 1481/2, 555 + 1926/2) = (2445.5, 1518)
const WIN_CENTER_OFFSET_X = (2445.5 - 2450) / 4900;  // ≈ -0.001（几乎0）
const WIN_CENTER_OFFSET_Y = (1518 - 1472) / 2944;     // ≈ +0.0156

// ── 各素材在 Figma 中相对视觉窗口的位置比例（待填入） ───────────
// 这些系数表示：素材中心点相对"视觉窗口中心"的偏移，单位是视觉窗口宽/高的倍数
// 正值=右/下，负值=左/上
// 先给出合理初始值，可后续微调
const LAYERS = {
  medical: {
    // 医疗主图：占据视觉窗口中心偏下
    xRatio: 0,        // 水平居中
    yRatio: 0.1,     // 略偏下
    wRatio: 0.72,     // 宽度 = 视觉窗口宽 × 0.85
  },
  top: {
    // 顶部文案：视觉窗口上方
    xRatio: 0,
    yRatio: -0.32,    // 窗口高度的0.78倍偏上
    wRatio: 0.92,     // 略宽于视觉窗口
  },
  grid: {
    // 格子背景：视觉窗口下半部
    xRatio: 0,
    yRatio: 0.1,
    wRatio: 0.9,
  },
  bot: {
    // 底部logo：视觉窗口底部下方
    xRatio: 0.003,
    yRatio: 0.468,
    wRatio: 0.996,
  },
};

export default function Section2() {
  const container = useRef(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [bgSize, setBgSize] = useState({ w: 0, h: 0 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 }); // 中间图中心相对屏幕中心的像素偏移

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // 监听中间图容器尺寸变化
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setBgSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setBgSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // 计算视觉窗口的实际像素尺寸
  const winW = bgSize.w * WIN_W_RATIO;
  const winH = bgSize.h * WIN_H_RATIO;
  // 视觉窗口中心相对屏幕中心的偏移（加上 bgY 的最终偏移）
  const winCX = bgSize.w * WIN_CENTER_OFFSET_X + bgOffset.x;
  const winCY = bgSize.h * WIN_CENTER_OFFSET_Y + bgOffset.y;

  // 各图最终落点（像素）
  const medFinalX = winCX + winW * LAYERS.medical.xRatio;
  const medFinalY = winCY + winH * LAYERS.medical.yRatio;
  const topFinalX = winCX + winW * LAYERS.top.xRatio;
  const topFinalY = winCY + winH * LAYERS.top.yRatio;
  const gridFinalX = winCX + winW * LAYERS.grid.xRatio;
  const gridFinalY = winCY + winH * LAYERS.grid.yRatio;
  const botFinalX = winCX + winW * LAYERS.bot.xRatio;
  const botFinalY = winCY + winH * LAYERS.bot.yRatio;

  // 各图最终宽度（像素）
  const medW = winW * LAYERS.medical.wRatio;
  const topW = winW * LAYERS.top.wRatio;
  const gridW = winW * LAYERS.grid.wRatio;
  const botW = winW * LAYERS.bot.wRatio;

  // ── motion values ────────────────────────────────────────────
  // 中间底图
  const bgScale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const bgFinalY = bgSize.h * WIN_CENTER_OFFSET_Y;
  const bgY = useTransform(scrollYProgress, [0, 0.4], [0, bgFinalY]);

  // 医疗主图：从左侧视口外飞入
  const mainScale = useTransform(scrollYProgress, [0, 0.67], [2.5, 1]);
  const mainX = useTransform(scrollYProgress, [0, 0.67], [-window.innerWidth * 1.2, medFinalX]);
  const mainY = useTransform(scrollYProgress, [0, 0.67], [medFinalY, medFinalY]);
  const mainOpacity = useTransform(scrollYProgress, [0, 0.1, 0.67], [0, 1, 1]);

  // 顶部文案：从上方视口外飞入
  const topScale = useTransform(scrollYProgress, [0, 0.67], [2.5, 1]);
  const topX = useTransform(scrollYProgress, [0, 0.67], [topFinalX, topFinalX]);
  const topY = useTransform(scrollYProgress, [0, 0.67], [-window.innerHeight * 1.2, topFinalY]);
  const topOpacity = useTransform(scrollYProgress, [0, 0.1, 0.67], [0, 1, 1]);

  // 格子背景：从右侧视口外飞入
  const gridScale = useTransform(scrollYProgress, [0, 0.67], [2.5, 1]);
  const gridX = useTransform(scrollYProgress, [0, 0.67], [window.innerWidth * 1.2, gridFinalX]);
  const gridY = useTransform(scrollYProgress, [0, 0.67], [gridFinalY, gridFinalY]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.1, 0.67], [0, 1, 1]);

  // 底部logo：从下方视口外飞入
  const botScale = useTransform(scrollYProgress, [0, 0.67], [2.5, 1]);
  const botX = useTransform(scrollYProgress, [0, 0.67], [botFinalX, botFinalX]);
  const botY = useTransform(scrollYProgress, [0, 0.67], [window.innerHeight * 1.2, botFinalY]);
  const botOpacity = useTransform(scrollYProgress, [0, 0.1, 0.67], [0, 1, 1]);

  return (
    <section style={{ position: 'relative', zIndex: 1 }}>
      {/* 文字区 */}
      <div
        style={{
          padding: '120px 0 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          className="page-container flex flex-col items-center"
          style={{ gap: 28, maxWidth: 880 }}
        >
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '28px',
              textAlign: 'center',
              letterSpacing: '-0.018em',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            用代码控制，生成可分层设计
          </p>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              fontSize: 44,
              lineHeight: '56px',
              textAlign: 'center',
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            用「城市乐享季」模版<br />生成一张生活服务医疗健康海报
          </h2>
        </div>
      </div>

      {/* 滚动动效区 */}
      <div ref={container} style={{ position: 'relative', height: '450vh' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 中间底图：固定居中，作为背景层 */}
          <motion.div
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scale: bgScale,
              opacity: bgOpacity,
              y: bgY,
              zIndex: 1,
            }}
          >
            <div ref={bgRef} style={{ width: '60vw', maxWidth: 1280 }}>
              <img
                src="/section2/中间图2.png"
                alt="中间底图"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>

          {/* 医疗主图：从左飞入 */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scale: mainScale,
              x: mainX,
              y: mainY,
              opacity: mainOpacity,
              zIndex: 3,
            }}
          >
            <div style={{ width: medW || '14vw' }}>
              <img
                src="/section2/医疗 2.png"
                alt="医疗素材"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>

          {/* 顶部文案：从上飞入 */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scale: topScale,
              x: topX,
              y: topY,
              opacity: topOpacity,
              zIndex: 4,
            }}
          >
            <div style={{ width: topW || '16.5vw' }}>
              <img
                src="/section2/顶部文案 3.png"
                alt="顶部文案"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>

          {/* 格子背景：从右飞入 */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scale: gridScale,
              x: gridX,
              y: gridY,
              opacity: gridOpacity,
              zIndex: 2,
            }}
          >
            <div style={{ width: gridW || '16vw' }}>
              <img
                src="/section2/格子背景 2.png"
                alt="格子背景素材"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>

          {/* 底部logo：从下飞入 */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scale: botScale,
              x: botX,
              y: botY,
              opacity: botOpacity,
              zIndex: 4,
            }}
          >
            <div style={{ width: botW || '18vw' }}>
              <img
                src="/section2/底部logo 2.png"
                alt="底部logo"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 底部间距 */}
      <div style={{ height: 160 }} />
    </section>
  );
}

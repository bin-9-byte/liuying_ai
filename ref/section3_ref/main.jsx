import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import glassesImage from "./assets/lovart-scroll/glasses.png";
import posterOne from "./assets/lovart-scroll/poster-1.png";
import posterTwo from "./assets/lovart-scroll/poster-2.png";
import posterThree from "./assets/lovart-scroll/poster-3.png";
import posterFour from "./assets/lovart-scroll/poster-4.png";

const posters = [
  { src: posterOne, label: "Poster 01" },
  { src: posterTwo, label: "Poster 02" },
  { src: posterThree, label: "Poster 03" },
  { src: posterFour, label: "Poster 04" }
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smooth(start, end, value) {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
}

function lerp(start, end, value) {
  return start + (end - start) * value;
}

function useScrollProgress(targetRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const node = targetRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const next = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);

  return progress;
}

function Header() {
  return (
    <header className="site-header" aria-label="Lovart navigation">
      <a className="brand" href="#top" aria-label="Lovart">
        <span className="brand-dot">Lo</span>
        <span>Lovart</span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#top">首页</a>
        <a href="#pricing">定价</a>
        <a href="#news">新闻</a>
      </nav>
      <a className="start-link" href="#start">开始体验</a>
    </header>
  );
}

function ImageLabel({ children }) {
  return (
    <div className="image-label" aria-hidden="true">
      <span className="label-icon" />
      <span>{children}</span>
      <span className="label-size">720 x 960</span>
    </div>
  );
}

function ScrollReplica() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  const styles = useMemo(() => {
    const promptIn = smooth(0.1, 0.22, progress);
    const promptOut = smooth(0.48, 0.6, progress);
    const productOut = smooth(0.58, 0.7, progress);
    const cardIn = smooth(0.66, 0.82, progress);
    const titleLift = smooth(0.7, 0.9, progress);

    return {
      title: {
        transform: `translate3d(0, ${lerp(0, -34, titleLift)}px, 0)`
      },
      product: {
        opacity: 1 - productOut,
        transform: `translate3d(0, ${lerp(14, -12, progress)}px, 0) scale(${lerp(1, 0.985, productOut)})`
      },
      prompt: {
        opacity: promptIn * (1 - promptOut),
        transform: `translate3d(-50%, ${lerp(44, 0, promptIn) - lerp(0, 22, promptOut)}px, 0)`
      },
      grid: {
        opacity: cardIn,
        transform: `translate3d(-50%, calc(-50% + ${lerp(58, 0, cardIn)}px), 0)`
      }
    };
  }, [progress]);

  return (
    <main id="top">
      <Header />
      <section ref={sectionRef} className="scroll-story" aria-label="Landing page scroll effect replica">
        <div className="sticky-frame">
          <div className="hero-copy" style={styles.title}>
            <p>自主智能</p>
            <h1>以系统思维设计</h1>
            <span>设计决策，并非一座孤岛。Lovart 将色彩、版式、语言统一为完整的品牌体系，从第一稿，到第一百稿。</span>
          </div>

          <div className="feature-stage">
            <div className="stage-content">
              <div className="artifact-stack">
                <figure className="product-card" style={styles.product}>
                  <ImageLabel>Image</ImageLabel>
                  <img src={glassesImage} alt="Smart glasses on a dark background" />
                </figure>

                <div className="prompt-card" style={styles.prompt}>
                  <div className="prompt-title">
                    <span className="prompt-badge">Eyewear</span>
                    <span>为该眼镜品牌创建一套电商活动海报</span>
                  </div>
                  <div className="prompt-actions">
                    <span className="paperclip" />
                    <span className="spark" />
                    <span className="arrow">↑</span>
                  </div>
                </div>
              </div>

              <div className="poster-grid" style={styles.grid}>
                {posters.map((poster, index) => {
                  const reveal = smooth(0.72 + index * 0.035, 0.92 + index * 0.02, progress);
                  const settle = smooth(0.68 + index * 0.025, 0.86 + index * 0.02, progress);
                  return (
                    <figure
                      className="poster-card"
                      key={poster.label}
                      style={{
                        "--reveal": `${100 - reveal * 100}%`,
                        "--card-y": `${lerp(34, 0, settle)}px`,
                        "--card-opacity": 0.42 + reveal * 0.58
                      }}
                    >
                      <ImageLabel>Image</ImageLabel>
                      <div className="poster-shell">
                        <div className="poster-placeholder" />
                        <img src={poster.src} alt={poster.label} />
                      </div>
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="after-section" id="start">
        <p>功能特性</p>
        <h2>设计，不止于生成</h2>
        <span>AI 只是起点，滚动中的每个阶段都可以被拆成可控的布局状态。</span>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<ScrollReplica />);

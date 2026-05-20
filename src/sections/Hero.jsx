// src/sections/Hero.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Hero.module.css";

const NAV = [
  { label: "事業内容", href: "#business" },
  { label: "ソリューション", href: "#solution" },
  { label: "導入事例", href: "#case" },
  { label: "企業情報", href: "#company" },
  { label: "採用情報", href: "#recruit" },
  { label: "ニュース", href: "#news" },
];

const HERO = {
  bg: "/hero-exas-meeting.png",

  // kicker：左に数字（論理）、右に立場（差別化）
  kickerLeft: "SUCCESS RATE 38%",
  kickerRight: "CLIENT-SIDE",

  // H1：2行
  title: "基幹刷新には、\n失敗の型がある。",

  // lead：※ "事故" で壊れてたので、日本語カギ括弧＋テンプレ文字列で安全に
  lead: `ベンダー側の内側で失敗の型を見てきたから、発注企業の代理人として“事故”を根本から潰せます。`,

  scope: "ERP入替 / 基幹刷新 / PMO / ベンダー選定・評価",

  ctaPrimary: { label: "お問い合わせ", href: "#contact" },
  ctaSecondary: { label: "EXASについて", href: "#company" },
};

export default function Hero() {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    setReduce(!!r);

    if (r) {
      setInView(true);
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.18, rootMargin: "-8% 0px -16% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onJump = useMemo(
    () => (href) => (e) => {
      if (!href?.startsWith("#")) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 104,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce]
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className={`${styles.section} ${inView ? styles.in : ""}`}
      style={{ "--hero": `url(${HERO.bg})` }}
      aria-label="EXAS ヒーロー"
    >
      {/* bg stack */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.read} aria-hidden="true" />

      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logo} href="#top" aria-label="EXAS Inc.">
            <span className={styles.logoMark} aria-hidden="true">
              X
            </span>
            <span className={styles.logoText}>EXAS</span>
          </a>

          <nav className={styles.nav} aria-label="グローバルナビ">
            {NAV.map((item) => (
              <a
                key={item.href}
                className={styles.navLink}
                href={item.href}
                onClick={onJump(item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className={styles.headerCta}
            href={HERO.ctaPrimary.href}
            onClick={onJump(HERO.ctaPrimary.href)}
          >
            {HERO.ctaPrimary.label}
          </a>
        </div>
      </header>

      {/* content */}
      <div className={styles.wrap}>
        <div className={styles.left}>
          <div className={styles.copyStage}>
            <div className={styles.statement}>
              <div className={styles.kickerRow}>
                <span className={styles.kicker}>{HERO.kickerLeft}</span>
                <span className={styles.kickerSub}>{HERO.kickerRight}</span>
              </div>

              {/* 2行タイトル：行ごとにマスクワイプ */}
              <h1 className={styles.title}>
                {HERO.title.split("\n").map((line, i) => (
                  <span
                    key={i}
                    className={styles.titleLine}
                    style={{ "--i": i }}
                  >
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className={styles.meta}>
              <p className={styles.lead}>{HERO.lead}</p>

              <div className={styles.scope} aria-label="対応領域">
                {HERO.scope}
              </div>

              <div className={styles.ctaRow}>
                <a
                  className={styles.ctaPrimary}
                  href={HERO.ctaPrimary.href}
                  onClick={onJump(HERO.ctaPrimary.href)}
                >
                  {HERO.ctaPrimary.label}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </a>

                <a
                  className={styles.ctaSecondary}
                  href={HERO.ctaSecondary.href}
                  onClick={onJump(HERO.ctaSecondary.href)}
                >
                  {HERO.ctaSecondary.label}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
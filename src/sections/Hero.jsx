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
  // public に置く前提
  bg: "/hero-exas-meeting.png",

  kickerLeft: "SUCCESS RATE 38%",
  kickerRight: "CLIENT-SIDE",

  title: "基幹刷新には、\n失敗の型がある。",

  lead: "ベンダー側の内側で失敗の型を見てきたから、発注企業の代理人として“事故”を根本から潰せます。",

  scope: "ERP入替 / 基幹刷新 / PMO / ベンダー選定・評価",

  // CTAは“ヘッダーに集約”する（本文は黙らせる）
  headerCta: { label: "お問い合わせ", href: "#contact" },

  // 英字オブジェクト（読ませない）
  bigEnA: "62%",
  bigEnB: "TRUST",
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

      // ヘッダーの縦を削ったのでオフセットも少し下げる
      const offset = 92;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
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

      {/* big english object (behind copy) */}
      <div className={styles.bigEn} aria-hidden="true">
        <span className={styles.bigEnA}>{HERO.bigEnA}</span>
        <span className={styles.bigEnB}>{HERO.bigEnB}</span>
      </div>

      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logo} href="#top" aria-label="EXAS Inc.">
            {/* public/EXAS.svg */}
            <img
              className={styles.logoSvg}
              src="/EXAS.svg"
              alt="EXAS"
              loading="eager"
              decoding="async"
            />
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
            href={HERO.headerCta.href}
            onClick={onJump(HERO.headerCta.href)}
          >
            {HERO.headerCta.label}
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

              <h1 className={styles.title}>
                {HERO.title.split("\n").map((line, i) => (
                  <span key={i} className={styles.titleLine} style={{ "--i": i }}>
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
              {/* CTAは本文から撤去：ヘッダーに集約 */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
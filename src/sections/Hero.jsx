// src/sections/Hero.jsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./Hero.module.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  kickerLeft: "SUCCESS RATE 38%",
  kickerRight: "CLIENT-SIDE",

  title: "基幹刷新には、\n失敗の型がある。",
  lead:
    "ベンダー側の内側で失敗の型を見てきたから、発注企業の代理人として“事故”を根本から潰せます。",
  scope: "ERP入替 / 基幹刷新 / PMO / ベンダー選定・評価",

  headerCta: { label: "お問い合わせ", href: "#contact" },

  bigEnA: "62%",
  bigEnB: "TRUST",
};
const TICKER_ITEMS = [
  { text: "2026年3月期 第3四半期決算説明会資料を掲載しました。", href: "#news" },
  { text: "システムメンテナンスのお知らせ（5/25 2:00〜4:00）", href: "#news" },
  { text: "導入事例を1件追加しました。", href: "#case" },
];

const prefersReduce = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

export default function Hero() {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);

  const [tickIdx, setTickIdx] = useState(0);
  const [tickPhase, setTickPhase] = useState("enter");
  const [tickPaused, setTickPaused] = useState(false);
  const tickIntervalRef = useRef(null);
  const tickLeaveRef = useRef(null);

  useEffect(() => {
    const r = prefersReduce();
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

      const headerEl = document.querySelector('[data-hero-header="1"]');
      const offset =
        headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) + 12 : 92;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce]
  );

  useEffect(() => {
    const items = TICKER_ITEMS;
    if (!items?.length || items.length <= 1) return;

    if (tickIntervalRef.current) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (tickLeaveRef.current) {
      window.clearTimeout(tickLeaveRef.current);
      tickLeaveRef.current = null;
    }

    if (tickPaused) return;

    if (reduce) {
      tickIntervalRef.current = window.setInterval(() => {
        setTickIdx((v) => (v + 1) % items.length);
      }, 6500);
      return () => {
        if (tickIntervalRef.current) {
          window.clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
      };
    }

    const interval = 6500;
    const leaveMs = 240;

    tickIntervalRef.current = window.setInterval(() => {
      setTickPhase("leave");

      tickLeaveRef.current = window.setTimeout(() => {
        setTickIdx((v) => (v + 1) % items.length);
        setTickPhase("prep");
        requestAnimationFrame(() => setTickPhase("enter"));
      }, leaveMs);
    }, interval);

    return () => {
      if (tickIntervalRef.current) {
        window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (tickLeaveRef.current) {
        window.clearTimeout(tickLeaveRef.current);
        tickLeaveRef.current = null;
      }
    };
  }, [reduce, tickPaused]);

  const tickItem = TICKER_ITEMS[tickIdx] || TICKER_ITEMS[0];

  const pauseTicker = () => {
    setTickPaused(true);
    setTickPhase("enter");
  };
  const resumeTicker = () => setTickPaused(false);

  useLayoutEffect(() => {
    if (prefersReduce()) return;

    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      const bg     = q(`.${styles.bg}`);
      const veil   = q(`.${styles.veil}`);
      const read   = q(`.${styles.read}`);
      const depth  = q(`.${styles.depth}`);

      const titleLines = q(`.${styles.titleLine}`);
      const lead       = q(`.${styles.lead}`);
      const scope      = q(`.${styles.scope}`);

      gsap.set(bg, { opacity: 0, scale: 1.08, y: 8, transformOrigin: "50% 50%" });
      gsap.set([veil, read, depth], { opacity: 0 });
      gsap.set(titleLines, { opacity: 0, y: 28 });
      gsap.set([lead, scope], { opacity: 0, y: 12 });
    }, el);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (prefersReduce()) return;
    if (!inView) return;

    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      const bg     = q(`.${styles.bg}`);
      const veil   = q(`.${styles.veil}`);
      const read   = q(`.${styles.read}`);
      const depth  = q(`.${styles.depth}`);

      const titleLines = q(`.${styles.titleLine}`);
      const lead       = q(`.${styles.lead}`);
      const scope      = q(`.${styles.scope}`);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(veil,  { opacity: 0.90, duration: 0.95, ease: "power2.out" }, 0)
        .to(read,  { opacity: 0.88, duration: 0.95, ease: "power2.out" }, 0)
        .to(depth, { opacity: 0.84, duration: 0.95, ease: "power2.out" }, 0)
        .to(bg, { opacity: 0.985, scale: 1.02, y: 0, duration: 1.10, ease: "power2.out" }, 0)
        .to(
          titleLines,
          { opacity: 1, y: 0, duration: 0.78, stagger: 0.10 },
          0.12
        )
        .to(
          [lead, scope],
          { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 },
          0.52
        );
    }, el);

    return () => ctx.revert();
  }, [inView]);

  useLayoutEffect(() => {
    if (prefersReduce()) return;

    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      const bg    = q(`.${styles.bg}`);
      const veil  = q(`.${styles.veil}`);
      const read  = q(`.${styles.read}`);
      const depth = q(`.${styles.depth}`);
      const bigEn = q(`.${styles.bigEn}`);

      gsap.to(bg, {
        scale: 1.0,
        y: -8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(veil, {
        opacity: 0.70,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(read, {
        opacity: 0.74,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(depth, {
        y: -18,
        opacity: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(bigEn, {
        y: 10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className={`${styles.section} ${inView ? styles.in : ""}`}
      style={{ "--hero": `url("${HERO.bg}")` }}
      aria-label="EXAS ヒーロー"
    >
      <div className={styles.bg}    aria-hidden="true" />
      <div className={styles.veil}  aria-hidden="true" />
      <div className={styles.depth} aria-hidden="true" />
      <div className={styles.read}  aria-hidden="true" />

      <div className={styles.bigEn} aria-hidden="true">
        <span className={styles.bigEnA}>{HERO.bigEnA}</span>
        <span className={styles.bigEnB}>{HERO.bigEnB}</span>
      </div>

      <header className={styles.header} data-hero-header="1">
        <div
          className={styles.ticker}
          aria-label="お知らせ"
          onMouseEnter={pauseTicker}
          onMouseLeave={resumeTicker}
          onFocusCapture={pauseTicker}
          onBlurCapture={resumeTicker}
        >
          <span className={styles.tickerLabel}>NEWS</span>

          <span className={styles.tickerText} aria-live="polite" aria-atomic="true">
            <a
              className={`${styles.tickerMsg} ${
                tickPhase === "enter"
                  ? styles.msgEnter
                  : tickPhase === "leave"
                  ? styles.msgLeave
                  : styles.msgPrep
              }`}
              href={tickItem?.href ?? "#news"}
              onClick={onJump(tickItem?.href ?? "#news")}
            >
              {tickItem?.text ?? ""}
            </a>
          </span>
        </div>

        <div className={styles.headerInner}>
          <a className={styles.logo} href="#top" aria-label="EXAS Inc.">
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

          <div className={styles.util}>
            <div className={styles.lang} aria-label="言語切替">
              <a className={`${styles.langLink} ${styles.langActive}`} href="#top">
                JP
              </a>
              <span className={styles.langSep} aria-hidden="true">/</span>
              <a className={styles.langLink} href="#top">
                EN
              </a>
            </div>

            <a
              className={styles.headerCta}
              href={HERO.headerCta.href}
              onClick={onJump(HERO.headerCta.href)}
            >
              {HERO.headerCta.label}
            </a>

            <button className={styles.menuBtn} type="button" aria-label="メニュー">
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </button>
          </div>
        </div>
      </header>

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
                  <span key={i} className={styles.titleLine}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
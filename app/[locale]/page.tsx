"use client";

import {
  ArrowDown, ArrowUpRight, Blocks, Bot, ChartNoAxesCombined, Check,
  Code2, Database, Gauge, Layers3, Route, Settings2, Smartphone, Sparkles, Workflow
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/app/components/SiteShell";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useTheme } from "next-themes";

function SplashScreen() {
  const t = useTranslations("SplashScreen");
  return (
    <div className="splash" role="status" aria-label="Chargement de l’expérience Keleya">
      <div className="splash__panel splash__panel--one" aria-hidden="true" />
      <div className="splash__panel splash__panel--two" aria-hidden="true" />
      <div className="splash__top">
        <span className="splash__brand"><Image src="/keleya-mark-red.png" alt="" width="84" height="84" priority unoptimized />Keleya</span>
        <span>{t("initialization")}</span>
      </div>
      <div className="splash__center" aria-hidden="true">
        <span>K</span>
        <div className="splash__word">
          {"KELEYA".split("").map((letter, index) => (
            <i key={`${letter}-${index}`} style={{ "--letter": index } as React.CSSProperties}>{letter}</i>
          ))}
        </div>
      </div>
      <div className="splash__bottom">
        <span>{t("engineering")}</span>
        <div className="splash__progress"><i /></div>
        <span className="splash__count"><i>000</i><i>100</i></span>
      </div>
    </div>
  );
}

function ProcessExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const t = useTranslations("Process");

  const phases = [
    ["01", t("phases.p1.title"), t("phases.p1.text")],
    ["02", t("phases.p2.title"), t("phases.p2.text")],
    ["03", t("phases.p3.title"), t("phases.p3.text")],
    ["04", t("phases.p4.title"), t("phases.p4.text")],
    ["05", t("phases.p5.title"), t("phases.p5.text")],
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(0.999, Math.max(0, -rect.top / distance));
      const nextPhase = Math.min(phases.length - 1, Math.floor(progress * phases.length));
      section.style.setProperty("--process-progress", `${progress * 100}%`);
      setActivePhase((current) => current === nextPhase ? current : nextPhase);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className={`process-experience process-experience--${activePhase + 1}`} id="process" ref={sectionRef}>
      <div className="process-stage">
        <div className="process-grid" aria-hidden="true" />
        <div className="process-rail" aria-hidden="true"><i /></div>
        <div className="process-stage__top">
          <span>{t("label")}</span>
          <p dangerouslySetInnerHTML={{ __html: t.raw("desc") }} />
        </div>
        <div className="process-phases" aria-live="polite">
          {phases.map(([number, title, text], index) => (
            <article
              className={`process-phase${index === activePhase ? " is-active" : ""}${index < activePhase ? " is-past" : ""}`}
              aria-hidden={index !== activePhase}
              key={number}
            >
              <small>{t("phasePrefix")} {Number(number)}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="process-stage__bottom">
          <span>{String(activePhase + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}</span>
          <div>{phases.map(([, title], index) => <i className={index <= activePhase ? "is-active" : ""} key={title} />)}</div>
          <span>{t("scroll")}</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const tHero = useTranslations("HomeHero");
  const tVision = useTranslations("Vision");
  const tExp = useTranslations("Expertise");
  const tPrec = useTranslations("Precision");
  const tCta = useTranslations("Cta");
  
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setShowSplash(false), reducedMotion ? 350 : 3300);
    return () => window.clearTimeout(timer);
  }, []);

  const expertise = [
    { icon: Smartphone, scene: [Smartphone, Code2, Blocks], tag: tExp("items.apps.tag"), title: tExp("items.apps.title"), text: tExp("items.apps.text") },
    { icon: Workflow, scene: [Workflow, Settings2, Gauge], tag: tExp("items.ops.tag"), title: tExp("items.ops.title"), text: tExp("items.ops.text") },
    { icon: Layers3, scene: [Layers3, Route, Check], tag: tExp("items.pm.tag"), title: tExp("items.pm.title"), text: tExp("items.pm.text") },
    { icon: ChartNoAxesCombined, scene: [ChartNoAxesCombined, Database, Bot], tag: tExp("items.data.tag"), title: tExp("items.data.title"), text: tExp("items.data.text") },
  ];

  const isLight = mounted && resolvedTheme === "light";

  return (
    <>{showSplash && <SplashScreen />}<PageShell current="/">
      <main id="contenu">
        <section className={`home-hero ${isLight ? 'bg-[#FAFAFA]' : ''}`} style={isLight ? { background: '#FAFAFA' } : {}}>
          <video className={`hero-video ${isLight ? 'opacity-30' : ''}`} autoPlay muted loop playsInline preload="metadata"><source src="/keleya-hero.mp4" type="video/mp4" /></video>
          <div className={`hero-overlay ${isLight ? 'bg-white/70' : ''}`} style={isLight ? { background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7) 60%, transparent), linear-gradient(0deg, rgba(255,255,255,0.8), transparent 55%)' } : {}} /><div className="hero-grid" style={isLight ? { filter: 'invert(1)', opacity: 0.1 } : {}} />
          <div className="home-hero-content">
            <p className={`eyebrow hero-in one ${isLight ? 'text-zinc-600' : 'light'}`}><i /> {tHero("eyebrow")}</p>
            <h1 className={isLight ? 'text-[#101010]' : ''}>
              <span className="hero-in two">{tHero("title1")}</span>
              <span className="hero-in three"><span className="hero-keyword hero-performance">{tHero("title2")}</span></span>
              <span className="hero-in four hero-phrase">{tHero("title3")} <span className="hero-keyword">{tHero("title4")}</span></span>
            </h1>
            <div className="hero-lower hero-in five">
              <p className={isLight ? 'text-zinc-700' : ''} style={isLight ? { color: '#3f3f46' } : {}}>{tHero("copy")}</p>
              <div><Link className="button red" href="/contact">{tHero("contact")} <ArrowUpRight /></Link><a className={`text-link ${isLight ? 'text-zinc-900 border-zinc-900' : 'light'}`} style={isLight ? { color: '#18181b', borderColor: '#18181b' } : {}} href="#vision">{tHero("discover")} <ArrowDown /></a></div>
            </div>
          </div>
          <div className="hero-stamp"><span>{tHero("stamp1")}</span><small>{tHero("stamp2")}</small></div>
        </section>

        <section className="vision-section light-section" id="vision">
          <div className="section-label" data-reveal><span>{tVision("label")}</span><i /></div>
          <div className="vision-layout">
            <h2 data-reveal dangerouslySetInnerHTML={{ __html: tVision.raw("title") }} />
            <div className="vision-aside" data-reveal><p>{tVision("aside1")}</p><p>{tVision("aside2")}</p></div>
          </div>
          <div className="value-strip" data-reveal>
            <div><span>01</span><strong>{tVision("val1Title")}</strong><small>{tVision("val1Text")}</small></div>
            <div><span>02</span><strong>{tVision("val2Title")}</strong><small>{tVision("val2Text")}</small></div>
            <div><span>03</span><strong>{tVision("val3Title")}</strong><small>{tVision("val3Text")}</small></div>
          </div>
        </section>

        <section className="expertise-section dark-section" id="expertise">
          <div className="section-label light" data-reveal><span>{tExp("label")}</span><i /></div>
          <div className="section-intro" data-reveal><p className="eyebrow light">{tExp("intro")}</p><h2 dangerouslySetInnerHTML={{ __html: tExp.raw("title") }} /></div>
          <div className="expertise-grid">
            {expertise.map((item, i) => { const Icon = item.icon; return <article className="expertise-card" data-reveal key={item.title}>
              <div className="expertise-card__glow" aria-hidden="true" />
              <div className="expertise-visual" aria-hidden="true">
                <span className="expertise-visual__orbit" />
                {item.scene.map((SceneIcon, iconIndex) => <i className={`expertise-visual__icon icon-${iconIndex + 1}`} key={iconIndex}><SceneIcon /></i>)}
                <Sparkles className="expertise-visual__spark" />
              </div>
              <div className="card-top"><span>0{i + 1}</span><Icon /></div>
              <div className="expertise-card__copy"><small>{item.tag}</small><h3>{item.title}</h3><p>{item.text}</p></div>
              <ArrowUpRight className="card-arrow" />
            </article>; })}
          </div>
        </section>

        <ProcessExperience />

        <section className="precision-section light-section">
          <div className="precision-mark" data-reveal><div className="precision-logo"><span className="precision-logo__disc"><Image src="/keleya-mark-red.png" alt="" width="1600" height="1600" unoptimized /></span><strong>Keleya</strong></div><span>{tPrec("mark")}</span></div>
          <div className="precision-copy" data-reveal>
            <p className="eyebrow">{tPrec("eyebrow")}</p>
            <h2 dangerouslySetInnerHTML={{ __html: tPrec.raw("title") }} />
            <p>{tPrec("copy")}</p>
            <ul><li><Check /> {tPrec("list1")}</li><li><Check /> {tPrec("list2")}</li><li><Check /> {tPrec("list3")}</li></ul>
          </div>
        </section>

        <section className="cta-band"><p className="eyebrow light">{tCta("eyebrow")}</p><h2 data-reveal dangerouslySetInnerHTML={{ __html: tCta.raw("title") }} /><Link className="button white" href="/contact">{tCta("button")} <ArrowUpRight /></Link></section>
      </main>
    </PageShell></>
  );
}

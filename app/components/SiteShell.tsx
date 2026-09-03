"use client";

import { ArrowUpRight, Menu, X, Globe, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 16, height: 16 }} />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
      aria-label="Basculer le thème"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} className="text-[#101010]" />}
    </button>
  );
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const textColor = mounted && resolvedTheme === "light" ? "!text-zinc-900" : "!text-white";

  return (
    <div className={`language-switcher flex items-center gap-2 text-xs uppercase tracking-wider font-medium ${textColor}`}>
      <Globe size={14} className="opacity-70" />
      <button
        onClick={() => switchLanguage("fr")}
        style={{ fontWeight: locale === "fr" ? "700" : "400", background: "none", border: "none", cursor: "pointer", color: "inherit" }}
      >
        FR
      </button>
      <span style={{ opacity: 0.3 }}>|</span>
      <button
        onClick={() => switchLanguage("en")}
        style={{ fontWeight: locale === "en" ? "700" : "400", background: "none", border: "none", cursor: "pointer", color: "inherit" }}
      >
        EN
      </button>
    </div>
  );
}

export function Brand() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const textColor = mounted && resolvedTheme === "light" ? "!text-zinc-900" : "!text-white";

  return (
    <Link className={`brand flex items-center gap-2 ${textColor}`} href="/" aria-label="Keleya — Accueil">
      <Image src="/keleya-mark-red.png" alt="" width="84" height="84" unoptimized />
      <span>Keleya</span>
    </Link>
  );
}

export function Header({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("SiteShell.nav");
  const cta = useTranslations("SiteShell");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    [t("home"), "/"],
    [t("about"), "/a-propos"],
    [t("services"), "/services"],
    [t("contact"), "/contact"],
  ];

  const isLight = mounted && resolvedTheme === "light";
  
  const headerBg = isLight
    ? (scrolled ? "bg-[#f7f6f3]/90 backdrop-blur-md border-b border-gray-200" : "bg-[#f7f6f3] border-b border-gray-100")
    : (scrolled ? "bg-[#191919]/90 backdrop-blur-md border-b border-transparent" : "bg-transparent border-b border-transparent");

  const linkClass = isLight
    ? "!text-zinc-800 opacity-80 hover:opacity-100 hover:!text-zinc-900 transition-all"
    : "!text-gray-300 hover:!text-white transition-all";

  const ctaClass = isLight
    ? "bg-[#eb2038] !text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
    : "";

  return (
    <header className={`site-header flex items-center justify-between w-full flex-nowrap transition-colors duration-300 ${headerBg}`}>
      <Brand />

      <nav className={`flex-1 justify-center relative z-10 ${open ? "site-nav is-open" : "site-nav"}`} aria-label="Navigation principale">
        {links.map(([label, href]) => (
          <Link key={href} className={`${current === href ? "is-active" : ""} ${linkClass}`} href={href as any} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>

      {/* ml-auto pousse tout ce bloc au fond à droite */}
      <div className="flex items-center gap-5 ml-auto">
        <ThemeToggle />
        <LanguageSwitcher />
        <Link className={`header-cta whitespace-nowrap ${ctaClass}`} href="/contact">
          {cta("headerCta")} <ArrowUpRight size={16} />
        </Link>
      </div>

      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}>
        {open ? <X /> : <Menu className={isLight ? "text-black" : "text-white"} />}
      </button>
      <span className="header-signal" />
    </header>
  );
}

export function Footer() {
  const t = useTranslations("SiteShell");

  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <p className="eyebrow light">{t("footerLead")}</p>
        <h2 dangerouslySetInnerHTML={{ __html: t.raw("footerTitle") }} />
        <Link className="circle-link" href="/contact" aria-label="Lancer un projet"><ArrowUpRight /></Link>
      </div>
      <div className="footer-meta">
        <Brand />
        <div><small>{t("footerWrite")}</small><a href="mailto:contact@keleya.app">contact@keleya.app</a></div>
        <div><small>{t("footerFind")}</small><a href="#">LinkedIn</a><a href="#">Instagram</a></div>
      </div>
      <div className="footer-bottom"><span>{t("footerRights")}</span><span>{t("footerLocation")}</span></div>
    </footer>
  );
}

export function RevealObserver() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return null;
}

export function PageShell({ current, children }: { current: string; children: React.ReactNode }) {
  const t = useTranslations("SiteShell");
  return <><a className="skip-link" href="#contenu">{t("skip")}</a><Header current={current} /><RevealObserver />{children}<Footer /></>;
}

export function PageHero({ index, kicker, title, accent, copy }: { index: string; kicker: string; title: string; accent: string; copy: string }) {
  const t = useTranslations("SiteShell");
  return (
    <section className="page-hero">
      <div className="page-hero-grid" />
      <div className="page-hero-top"><span>{index}</span><span>{kicker}</span></div>
      <h1><span>{title}</span><em>{accent}</em></h1>
      <p>{copy}</p>
      <div className="scroll-cue"><span>{t("scrollCue")}</span><i /></div>
    </section>
  );
}
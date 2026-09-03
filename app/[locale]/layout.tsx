import I18nProvider from '@/app/components/I18nProvider';
import {ThemeProvider} from '@/app/components/ThemeProvider';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
import "@/app/globals.css";
import "@/app/design.css";

const display = Syne({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    metadataBase: new URL("https://keleya.cm"),
    title: { default: t('title'), template: "%s — Keleya" },
    description: t('description'),
    keywords: ["digitalisation opérationnelle", "création d’applications", "gestion de projets digitaux", "Cameroun", "automatisation"],
    icons: {
      icon: [
        { url: "/favicon.ico?v=3", sizes: "any" },
        { url: "/favicon-32x32.png?v=3", type: "image/png", sizes: "32x32" },
      ],
      shortcut: "/favicon.ico?v=3",
      apple: "/apple-touch-icon.png?v=3",
    },
    openGraph: { title: t('title'), description: t('description'), type: "website", locale: locale === "en" ? "en_US" : "fr_CM", siteName: "Keleya" },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png?v=3" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider locale={locale} messages={messages}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

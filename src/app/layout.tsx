import type { Metadata } from 'next';
import Script from 'next/script';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jyut.hk'),
  title: {
    default: 'JYUT.HK · 粵語學習空間 | 粵拼與詞典官方門戶',
    template: '%s | JYUT.HK',
  },
  description: 'JYUT.HK 是專業粵語查詞、粵拼發音與數字學習門戶。權威收錄 Words.hk (粵典) 詞庫，精選全網 27+ 頂尖學習導航、九聲六調色彩分拆，支持 Google/Edge 真人粵語發音與實用拼音工具。',
  keywords: [
    'JYUT.HK',
    '粵語學習',
    'jyut.hk',
    '粵語詞典',
    '粵拼',
    'Jyutping',
    'Words.hk',
    '粵典',
    '粵語發音',
    '廣東話學習',
    '九聲六調',
    '學習導航',
    'Yale Pinyin',
    '粵語懸浮詞典',
    'Cantonese dictionary',
  ],
  authors: [{ name: 'JYUT.HK & Jyutping Extension Team', url: 'https://jyut.hk' }],
  creator: 'JYUT.HK Team',
  publisher: 'JYUT.HK',
  alternates: {
    canonical: 'https://jyut.hk',
    languages: {
      'zh-HK': 'https://jyut.hk',
      'zh-Hant': 'https://jyut.hk',
      'zh-Hans': 'https://jyut.hk',
      'x-default': 'https://jyut.hk',
    },
  },
  icons: {
    icon: '/logo-flower.svg',
    shortcut: '/logo-flower.svg',
    apple: '/logo-flower.svg',
  },
  openGraph: {
    title: 'JYUT.HK · 專業粵語學習與數字門戶',
    description: '權威收錄 Words.hk 粵典，精選學習導航、九聲六調色彩拆解與 Google/Edge 真人粵語發音。',
    url: 'https://jyut.hk',
    siteName: 'JYUT.HK 粵語學習空間',
    locale: 'zh_HK',
    type: 'website',
    images: [
      {
        url: '/promo_marquee.png',
        width: 1200,
        height: 630,
        alt: 'JYUT.HK 粵語學習空間 & 粵語懸浮詞典',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JYUT.HK · 專業粵語學習空間',
    description: '專業粵語查詞、粵拼發音與數字門戶。權威收錄 Words.hk 粵典，精選全網 27+ 頂尖學習導航。',
    images: ['/promo_marquee.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'dMFa6TwDVQYKD6Ttry8pZquO20OdgA9CY9v432Kod6s',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://jyut.hk/#website',
      url: 'https://jyut.hk',
      name: 'JYUT.HK 粵語學習空間',
      description: '專業粵語查詞、粵拼發音與數字學習門戶。',
      inLanguage: 'zh-HK',
      publisher: {
        '@id': 'https://jyut.hk/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://jyut.hk/#organization',
      name: 'JYUT.HK',
      url: 'https://jyut.hk',
      logo: 'https://jyut.hk/logo-flower.svg',
      sameAs: [
        'https://github.com/Ousinki/jyut-hk',
        'https://github.com/Ousinki/jyutping-extension',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://jyut.hk/#software',
      name: '粵語懸浮詞典 (Jyutping Extension)',
      operatingSystem: 'Chrome, Edge, Brave, Chromium',
      applicationCategory: 'BrowserExtension',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: '強大的開源粵語查詞與發音瀏覽器擴展，權威集成 Words.hk 粵典與 Google 真人語音。',
      image: 'https://jyut.hk/promo_marquee.png',
      softwareVersion: '1.5.0',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://jyut.hk/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: '粵語懸浮詞典是免費的嗎？需要付費訂閱嗎？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '本擴展完全免費、開源且無任何廣告！所有核心功能（Words.hk 權威詞庫、Google 官方真人粵語發音、Edge TTS、九聲六調色彩拆解、生詞本與拼寫練習）均永久免費開放使用。',
          },
        },
        {
          '@type': 'Question',
          name: '如何在網頁瀏覽中觸發查詞與發音？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '支持多種靈活觸發方式：① 鼠標劃詞選擇文本即可即時彈出；② 雙擊單字或詞語自動識別；③ 在設置中開啟「按住 Shift + 鼠標懸停」快速觸發。',
          },
        },
        {
          '@type': 'Question',
          name: '支持哪些語音發音引擎？發音不清晰怎麼辦？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '擴展內置了三層立體發音引擎：① Google 官方真人粵語 TTS；② Edge TTS 高清人聲；③ 系統本地 Web Speech 離線容災。在擴展設置頁中可自由切換默認發音引擎。',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-HK" className={`${inter.variable} ${cinzel.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var t = localStorage.getItem('jyutping_website_theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

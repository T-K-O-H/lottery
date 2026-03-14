import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pblucky.com"),
  title: "PB Lucky Draw AI - Free Lottery Number Generator | Powerball & Mega Millions",
  description: "Free AI-powered lottery number generator for Powerball, Mega Millions, Pick 3, and Pick 4. Uses pattern analysis, hot/cold tracking, and 6 smart strategies to pick your lucky numbers.",
  keywords: [
    "powerball number generator",
    "mega millions number generator",
    "lottery number generator",
    "pick 3 number generator",
    "pick 4 number generator",
    "AI lottery generator",
    "powerball picks",
    "lucky lottery numbers",
    "hot and cold lottery numbers",
    "lottery number picker",
    "free lottery generator",
    "powerball quick pick alternative"
  ],
  authors: [{ name: "PB Lucky Draw AI" }],
  creator: "PB Lucky Draw AI",
  publisher: "PB Lucky Draw AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PB Lucky Draw AI",
    title: "PB Lucky Draw AI - Free Lottery Number Generator",
    description: "Free AI-powered number generator for Powerball, Mega Millions, Pick 3 & Pick 4. 6 smart strategies including hot numbers, cold numbers, and balanced picks.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PB Lucky Draw AI - Lottery Number Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PB Lucky Draw AI - Free Lottery Number Generator",
    description: "Free AI-powered number generator for Powerball, Mega Millions, Pick 3 & Pick 4. Try your luck today!",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon-512.jpg",
    apple: "/icon-512.jpg",
  },
  alternates: {
    canonical: "/",
  },
  category: "Entertainment",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PB Lucky Draw AI",
  "description": "Free AI-powered lottery number generator for Powerball, Mega Millions, Pick 3, and Pick 4",
  "url": "https://pblucky.com",
  "applicationCategory": "Entertainment",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

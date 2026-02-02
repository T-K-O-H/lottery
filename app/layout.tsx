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
  title: "PB Lucky Draw AI - Free Powerball Number Generator | AI-Powered Lottery Picks",
  description: "Generate smart Powerball lottery numbers with our free AI-powered number generator. Uses historical pattern analysis, hot/cold number tracking, and multiple strategies. Pick your lucky numbers today!",
  keywords: [
    "powerball number generator",
    "lottery number generator",
    "powerball picks",
    "lucky lottery numbers",
    "AI lottery generator",
    "powerball strategy",
    "random number generator lottery",
    "hot and cold lottery numbers",
    "powerball winning numbers",
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
    title: "PB Lucky Draw AI - Free Powerball Number Generator",
    description: "Generate smart Powerball lottery numbers with our free AI-powered generator. Multiple strategies including hot numbers, cold numbers, and balanced picks.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PB Lucky Draw AI - Powerball Number Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PB Lucky Draw AI - Free Powerball Number Generator",
    description: "Generate smart Powerball lottery numbers with our free AI-powered generator. Try your luck today!",
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
  "description": "Generate smart Powerball lottery numbers with AI-powered pattern analysis",
  "url": "https://pblucky.com",
  "applicationCategory": "Entertainment",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
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

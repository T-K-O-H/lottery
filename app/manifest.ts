import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PB Lucky Draw AI - Powerball Number Generator",
    short_name: "PB Lucky",
    description: "Generate smart Powerball lottery numbers with AI-powered pattern analysis",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#a78bfa",
    icons: [
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}

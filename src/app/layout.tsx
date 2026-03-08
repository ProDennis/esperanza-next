import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pupuseria Esperanza",
  description: "Pupusas artesanales, curtido casero y salsa tradicional. En Pupuseria Esperanza vivimos el sabor salvadoreño en cada bocado. ¡Visítanos o pide ya!",
  metadataBase: new URL("https://pupuseriaesperanzas.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://pupuseriaesperanzas.com",
    type: "website",
    title: "Pupuseria Esperanza",
    description: "Pupusas artesanales, curtido casero y salsa tradicional. En Pupuseria Esperanza vivimos el sabor salvadoreño en cada bocado. ¡Visítanos o pide ya!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pupuseria Esperanza Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pupuseria Esperanza",
    description: "Pupusas artesanales, curtido casero y salsa tradicional. En Pupuseria Esperanza vivimos el sabor salvadoreño en cada bocado. ¡Visítanos o pide ya!",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo_no_text.webp",
    shortcut: "/logo_no_text.webp",
    apple: "/logo_no_text.webp",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

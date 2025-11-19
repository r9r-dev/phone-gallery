import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Phone Gallery | My Mobile Phone History",
  description: "A personal gallery showcasing my mobile phone history from 2000 to present, featuring phones from Apple, Google, Sony, Samsung, Nokia, and more.",
  keywords: ["phone gallery", "mobile phone history", "phone collection", "smartphone evolution"],
  authors: [{ name: "Ronan" }],
  openGraph: {
    title: "Phone Gallery | My Mobile Phone History",
    description: "A personal gallery showcasing my mobile phone history from 2000 to present",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phone Gallery | My Mobile Phone History",
    description: "A personal gallery showcasing my mobile phone history from 2000 to present",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

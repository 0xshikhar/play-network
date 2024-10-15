// app/layout.js or pages/_app.js (depending on your Next.js version)
import type { Metadata } from "next";
import { Inter, Balsamiq_Sans, Galindo } from "next/font/google";
import "./globals.css";
import { PolkaProvider } from "@/app/providers";

// Load Inter, Balsamiq Sans, and Galindo fonts
const inter = Inter({ subsets: ["latin"] });
const balsamiqSans = Balsamiq_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-balsamiq",
});

const galindo = Galindo({
  subsets: ["latin"],
  variable: "--font-galindo",
  weight: "400",
});

import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import Navbar from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: "Play Network",
  description: "Powered by Dynamic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${balsamiqSans.variable} ${galindo.variable}`}>
      <body className={`${inter.className} font-balsamiq`}>
        <PolkaProvider>
          <Navbar />
          {children}
        </PolkaProvider>
      </body>
    </html>
  );
}

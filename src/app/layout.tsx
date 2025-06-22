import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner"
import { Providers } from "~/components/providers"


export const metadata: Metadata = {
  title: "LearnNYC",
  description: "Learn New York City with the help of some fun characters",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Typefully Clone - Thread Composer",
  description: "Create and schedule Twitter/X threads with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

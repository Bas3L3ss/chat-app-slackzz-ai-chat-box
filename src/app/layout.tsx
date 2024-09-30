import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Slackzz chat app",
  description: "Slack clone baseless's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className}  antialiased`}>{children}</body>
    </html>
  );
}

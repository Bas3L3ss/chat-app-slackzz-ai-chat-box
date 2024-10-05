import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import { Toaster as ToasterSonner } from "sonner";
import { Toaster } from "@/components/ui/toaster";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Slackzz chat app",
  description: "Slack clone baseless's",
};

export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className}  antialiased`}>
        <main>{children}</main>
        <ToasterSonner />
        <Toaster />
      </body>
    </html>
  );
}

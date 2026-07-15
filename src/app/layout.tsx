import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "../context/AppContext";
import { ToastContainer } from "../components/ToastContainer";
import { DashboardLayout } from "../components/DashboardLayout";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Car Fleet - Car Rental Admin",
  description: "Internal Car Rental Management web app for owner and staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased font-sans`}>
      <body className="min-h-full bg-gray-50/30 text-gray-900">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <AppContextProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <ToastContainer />
        </AppContextProvider>
      </body>
    </html>
  );
}

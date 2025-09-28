import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export const metadata: Metadata = {
  title: "BanCrap",
  description: "We brake banks",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
export default async function RootLayout({
  children,
  params
}: RootLayoutProps){

const { locale } = await params;
const allowedLocales = ["en", "es"];

  if (!allowedLocales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages(); 
  return (
    <html lang="es">
      <body>
        <NextIntlClientProvider messages={messages}>
        <Header />
        {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

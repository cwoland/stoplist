import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from '@/shared/ui/Toaster';
import { Providers } from './providers';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Стоп-лист кухни',
  description: 'Панель стоп-листа меню смены',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

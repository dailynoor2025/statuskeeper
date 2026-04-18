import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

/**
 * @fileOverview Root Layout Logic.
 * Optimized with Tier 1 global SEO metadata for high-quality user acquisition.
 */

export const metadata: Metadata = {
  title: 'Status keeper - Privacy-first status saver',
  description: 'The ultimate secure and fast WhatsApp status saver. Download HD stories, videos, and images instantly. Optimized for high performance and total user privacy.',
  keywords: ['status saver', 'whatsapp downloader', 'secure story saver', 'HD video downloader', 'privacy status saver', 'global status keeper'],
  authors: [{ name: 'Status Keeper Team' }],
  openGraph: {
    title: 'Status keeper - Professional status downloader',
    description: 'Save WhatsApp statuses in high definition without leaving a trace.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status keeper | Secure status saver',
    description: 'Fast, secure, and professional status downloader for Android.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" 
        />
      </head>
      <body className="font-body antialiased h-full overflow-hidden bg-slate-100">
        <div className="flex justify-center items-center h-[100dvh] w-full overflow-hidden">
          {/* Main app container: Scaled with adaptive logic */}
          <main className="app-container shadow-2xl transition-all duration-500 flex flex-col bg-white">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {children}
            </div>
          </main>
        </div>
        {/* Global notification system */}
        <Toaster />
      </body>
    </html>
  );
}

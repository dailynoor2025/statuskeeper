import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

/**
 * @fileOverview Root Layout Logic.
 * Manages the application container, adaptive scaling, and global notification system.
 */

export const metadata: Metadata = {
  title: 'StatusKeeper',
  description: 'WhatsApp Status Saver Android App',
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
          {/* Main App Container: Scaled with Adaptive Logic for Small/Large screens */}
          <main className="app-container shadow-2xl transition-all duration-500 flex flex-col bg-white">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {children}
            </div>
          </main>
        </div>
        {/* Global Notification System */}
        <Toaster />
      </body>
    </html>
  );
}

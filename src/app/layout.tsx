import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'VRISHTI | Urban Flood Intelligence',
  description: 'Real-time street-level flood depth prediction, drainage network simulation, and flood-safe routing for Indian metros.',
  keywords: ['Urban Flooding', 'Flood Nowcasting', 'Drainage Network', 'GIS Dashboard', 'Flood Routing', 'Flood Safety'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('vrishti-theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen font-sans text-base"
        suppressHydrationWarning
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'AquaAlert | Urban Flood Nowcasting System',
  description: 'Real-time 0–3 hour street-level flood depth prediction, coupled surface & underground drainage graph simulation, and dynamic flood-safe routing engine.',
  keywords: ['Urban Flooding', 'Nowcasting', 'Drainage Coupling', 'GIS Dashboard', 'Flood-Safe Routing', 'MoES', 'NCMRWF'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen" suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}


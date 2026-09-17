import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

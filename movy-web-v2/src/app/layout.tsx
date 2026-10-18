import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MOVY International - Ride & Mobility Platforms',
  description: 'MOVY Fleet Monitor & Central Dispatch Platform (US & BR)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#070A1A' }}>{children}</body>
    </html>
  );
}

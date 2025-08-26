import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getAuthenticatedUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: 'Cooperativa de Agua Potable',
  description: 'Gestión de servicios para la Cooperativa de Agua Potable.',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await getAuthenticatedUser();
  } catch (error) {
    console.error('Failed to connect to DB in RootLayout:', error);
  }

  return (
    <html lang='es' className={manrope.className} suppressHydrationWarning>
      <body className={`green-theme min-h-[100dvh] bg-background`}>
        <SWRConfig
          value={{
            fallback: {
              '/api/user': user,
            },
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}

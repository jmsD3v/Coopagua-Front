import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: 'Cooperativa de Agua',
  description: 'Gestión de servicios para la Cooperativa de Agua.',
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
  let team = null;

  // We wrap the database calls in a try...catch block.
  // If the DB is down, it won't crash the server. It will just log the error
  // and proceed as if the user is logged out.
  try {
    user = await getUser();
    team = await getTeamForUser();
  } catch (error) {
    console.error('Failed to connect to DB in RootLayout:', error);
  }

  return (
    <html lang='es' className={manrope.className} suppressHydrationWarning>
      <body className={`dark min-h-[100dvh] bg-background`}>
        <SWRConfig
          value={{
            fallback: {
              '/api/user': user,
              '/api/team': team,
            },
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}

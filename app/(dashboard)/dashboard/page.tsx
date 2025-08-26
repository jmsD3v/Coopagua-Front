'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is the old "Team Settings" page.
// Since we removed the concept of Teams, we will just redirect to the new
// main admin page, which is the user list.
export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/users');
  }, [router]);

  // Render a loading state while the redirect happens
  return <div>Redirigiendo al panel de usuarios...</div>;
}

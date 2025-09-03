import { User } from '@/lib/db/schema';

export const getDashboardPath = (role: User['role']) => {
  switch (role) {
    case 'admin':
    case 'superadmin':
      return '/dashboard/users';
    case 'técnico':
      return '/dashboard/gestion-tecnica';
    case 'socio':
    default:
      return '/dashboard/mi-cuenta';
  }
};

'use server';

import { redirect } from 'next/navigation';
import {
  createCheckoutPreference,
  redirectToCustomerPortal,
} from './mercadopago';
import { withTeam } from '@/lib/auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const title = formData.get('title') as string;
  const price = Number(formData.get('price'));
  await createCheckoutPreference({ team, title, price });
});

export const customerPortalAction = withTeam(async (_, team) => {
  redirectToCustomerPortal(team);
});

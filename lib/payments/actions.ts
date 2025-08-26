'use server';

import {
  createCheckoutPreference,
  redirectToCustomerPortal,
} from './mercadopago';
import { withUser } from '@/lib/auth/middleware';
import { getAuthenticatedUser } from '@/lib/db/queries';

export const checkoutAction = withUser(async (formData, user) => {
  const title = formData.get('title') as string;
  const price = Number(formData.get('price'));
  await createCheckoutPreference({ user, title, price });
});

export const customerPortalAction = withUser(async (_, user) => {
  redirectToCustomerPortal(user);
});

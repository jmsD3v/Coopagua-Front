import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import {
  getAuthenticatedUser,
  updateUserSubscription,
  getUserByMercadoPagoCustomerId,
  getUserById,
} from '@/lib/db/queries';

// Initialize the MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Create payment preference for a user
export async function createCheckoutPreference({
  user,
  title,
  price,
}: {
  user: User | null;
  title: string;
  price: number;
}) {
  let currentUser = user;

  if (!currentUser) {
    const sessionUser = await getAuthenticatedUser();
    if (sessionUser) {
      currentUser = await getUserById(sessionUser.id);
    }
  }

  if (!currentUser) {
    redirect(`/sign-in?redirect=checkout`);
  }

  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: [
        {
          id: title,
          title,
          quantity: 1,
          unit_price: price,
        },
      ],
      back_urls: {
        success: `${process.env.BASE_URL}/dashboard/users`, // Redirect to users dashboard on success
        failure: `${process.env.BASE_URL}/pricing`,
        pending: `${process.env.BASE_URL}/pricing`,
      },
      auto_return: 'approved',
      external_reference: currentUser.id.toString(),
      payer: {
        name: currentUser.name ?? undefined,
        email: currentUser.email,
      }
    },
  });

  redirect(response.init_point!);
}

// Redirect to the user's MercadoPago subscriptions page
export function redirectToCustomerPortal(user: User) {
  if (!user.mpCustomerId) {
    // Maybe redirect to a page explaining they have no subscription
    redirect('/dashboard/users');
  }
  // This is a generic link, a better solution would store the specific subscription link
  redirect(`https://www.mercadopago.com.ar/subscriptions`);
}

// Handle subscription changes from a webhook
export async function handleSubscriptionChange(mpData: any) {
  const customerId = mpData.customer_id;
  const subscriptionId = mpData.id;
  const status = mpData.status;

  const user = await getUserByMercadoPagoCustomerId(customerId);
  if (!user) {
    console.error('User not found for MercadoPago customer:', customerId);
    return;
  }

  if (status === 'authorized' || status === 'active') {
    await updateUserSubscription(user.id, {
      mpSubscriptionId: subscriptionId,
      mpCustomerId: customerId,
    });
  } else if (status === 'cancelled' || status === 'paused') {
    await updateUserSubscription(user.id, {
      mpSubscriptionId: null,
    });
  }
}

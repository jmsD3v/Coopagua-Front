import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import {
  getUser,
  updateTeamSubscription,
  getTeamByMercadoPagoCustomerId,
} from '@/lib/db/queries';

// 1. Initialize the MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Create payment preference
export async function createCheckoutPreference({
  team,
  title,
  price,
}: {
  team: Team | null;
  title: string;
  price: number;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout`);
  }

  // 2. Create a preference instance with the client
  const preference = new Preference(client);

  // 3. Create the preference using the new syntax
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
        success: `${process.env.BASE_URL}/api/mercadopago/success`,
        failure: `${process.env.BASE_URL}/pricing`,
        pending: `${process.env.BASE_URL}/pending`,
      },
      auto_return: 'approved',
      external_reference: user.id.toString(),
    },
  });

  redirect(response.init_point!);
}

// Simulate customer portal
export function redirectToCustomerPortal(team: Team) {
  if (!team.mpCustomerId) {
    redirect('/pricing');
  }

  redirect(`https://www.mercadopago.com.ar/subscriptions`);
}

// Handle subscription changes (from webhook)
export async function handleSubscriptionChange(mpData: any) {
  const customerId = mpData.customer_id;
  const subscriptionId = mpData.id;
  const status = mpData.status;

  const team = await getTeamByMercadoPagoCustomerId(customerId);
  if (!team) {
    console.error('Team not found for MercadoPago customer:', customerId);
    return;
  }

  if (status === 'authorized' || status === 'active') {
    await updateTeamSubscription(team.id, {
      mpSubscriptionId: subscriptionId,
      planName: mpData.reason,
      subscriptionStatus: status,
    });
  } else if (status === 'cancelled' || status === 'paused') {
    await updateTeamSubscription(team.id, {
      mpSubscriptionId: null,
      planName: null,
      subscriptionStatus: status,
    });
  }
}

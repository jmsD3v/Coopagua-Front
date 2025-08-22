import mercadopago from 'mercadopago';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import {
  getUser,
  updateTeamSubscription,
  getTeamByMercadoPagoCustomerId,
} from '@/lib/db/queries';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

// Crear preferencia de pago
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

  const preference = {
    items: [
      {
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
  };

  const response = await mercadopago.preferences.create(preference);
  redirect(response.body.init_point);
}

// Simular portal de cliente
export function redirectToCustomerPortal(team: Team) {
  if (!team.mpCustomerId) {
    redirect('/pricing');
  }

  redirect(`https://www.mercadopago.com.ar/subscriptions`);
}

// Manejar cambios de suscripción (desde webhook)
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

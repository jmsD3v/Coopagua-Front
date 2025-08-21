// import Stripe from 'stripe';
// import { redirect } from 'next/navigation';
// import { Team } from '@/lib/db/schema';
// import {
//   getTeamByStripeCustomerId,
//   getUser,
//   updateTeamSubscription
// } from '@/lib/db/queries';

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-04-30.basil'
// });

// export async function createCheckoutSession({
//   team,
//   priceId
// }: {
//   team: Team | null;
//   priceId: string;
// }) {
//   const user = await getUser();

//   if (!team || !user) {
//     redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
//   }

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1
//       }
//     ],
//     mode: 'subscription',
//     success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.BASE_URL}/pricing`,
//     customer: team.stripeCustomerId || undefined,
//     client_reference_id: user.id.toString(),
//     allow_promotion_codes: true,
//     subscription_data: {
//       trial_period_days: 14
//     }
//   });

//   redirect(session.url!);
// }

// export async function createCustomerPortalSession(team: Team) {
//   if (!team.stripeCustomerId || !team.stripeProductId) {
//     redirect('/pricing');
//   }

//   let configuration: Stripe.BillingPortal.Configuration;
//   const configurations = await stripe.billingPortal.configurations.list();

//   if (configurations.data.length > 0) {
//     configuration = configurations.data[0];
//   } else {
//     const product = await stripe.products.retrieve(team.stripeProductId);
//     if (!product.active) {
//       throw new Error("Team's product is not active in Stripe");
//     }

//     const prices = await stripe.prices.list({
//       product: product.id,
//       active: true
//     });
//     if (prices.data.length === 0) {
//       throw new Error("No active prices found for the team's product");
//     }

//     configuration = await stripe.billingPortal.configurations.create({
//       business_profile: {
//         headline: 'Manage your subscription'
//       },
//       features: {
//         subscription_update: {
//           enabled: true,
//           default_allowed_updates: ['price', 'quantity', 'promotion_code'],
//           proration_behavior: 'create_prorations',
//           products: [
//             {
//               product: product.id,
//               prices: prices.data.map((price) => price.id)
//             }
//           ]
//         },
//         subscription_cancel: {
//           enabled: true,
//           mode: 'at_period_end',
//           cancellation_reason: {
//             enabled: true,
//             options: [
//               'too_expensive',
//               'missing_features',
//               'switched_service',
//               'unused',
//               'other'
//             ]
//           }
//         },
//         payment_method_update: {
//           enabled: true
//         }
//       }
//     });
//   }

//   return stripe.billingPortal.sessions.create({
//     customer: team.stripeCustomerId,
//     return_url: `${process.env.BASE_URL}/dashboard`,
//     configuration: configuration.id
//   });
// }

// export async function handleSubscriptionChange(
//   subscription: Stripe.Subscription
// ) {
//   const customerId = subscription.customer as string;
//   const subscriptionId = subscription.id;
//   const status = subscription.status;

//   const team = await getTeamByStripeCustomerId(customerId);

//   if (!team) {
//     console.error('Team not found for Stripe customer:', customerId);
//     return;
//   }

//   if (status === 'active' || status === 'trialing') {
//     const plan = subscription.items.data[0]?.plan;
//     await updateTeamSubscription(team.id, {
//       stripeSubscriptionId: subscriptionId,
//       stripeProductId: plan?.product as string,
//       planName: (plan?.product as Stripe.Product).name,
//       subscriptionStatus: status
//     });
//   } else if (status === 'canceled' || status === 'unpaid') {
//     await updateTeamSubscription(team.id, {
//       stripeSubscriptionId: null,
//       stripeProductId: null,
//       planName: null,
//       subscriptionStatus: status
//     });
//   }
// }

// export async function getStripePrices() {
//   const prices = await stripe.prices.list({
//     expand: ['data.product'],
//     active: true,
//     type: 'recurring'
//   });

//   return prices.data.map((price) => ({
//     id: price.id,
//     productId:
//       typeof price.product === 'string' ? price.product : price.product.id,
//     unitAmount: price.unit_amount,
//     currency: price.currency,
//     interval: price.recurring?.interval,
//     trialPeriodDays: price.recurring?.trial_period_days
//   }));
// }

// export async function getStripeProducts() {
//   const products = await stripe.products.list({
//     active: true,
//     expand: ['data.default_price']
//   });

//   return products.data.map((product) => ({
//     id: product.id,
//     name: product.name,
//     description: product.description,
//     defaultPriceId:
//       typeof product.default_price === 'string'
//         ? product.default_price
//         : product.default_price?.id
//   }));
// }

import mercadopago from 'mercadopago';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import { getUser, updateTeamSubscription } from '@/lib/db/queries';

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

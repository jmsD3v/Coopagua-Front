import { handleSubscriptionChange } from '@/lib/payments/mercadopago';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === 'subscription_authorized') {
    const { data } = body;
    await handleSubscriptionChange({
      customer_id: data.id,
      id: data.id,
      status: 'authorized',
      reason: data.reason,
    });
  }

  return NextResponse.json({ status: 200 });
}

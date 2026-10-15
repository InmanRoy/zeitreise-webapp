import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  const { email, projectName } = await req.json();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: { name: "Zeitreise - Einmalige Erstellung" },
        unit_amount: 3499,
      },
      quantity: 1,
    }],
    mode: "payment",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/projekt/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/organisator?canceled=true`,
  });
  return NextResponse.json({ url: session.url });
}
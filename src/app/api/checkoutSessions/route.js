import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { genSuccessData, genUnAuthData, genErrorData } from "../utils/gen-res-data";
import { stripe } from '@/lib/stripe'
import { getUserInfo } from "@/lib/session"
export async function POST() {
    const userInfo = await getUserInfo();
    if (userInfo == null) return NextResponse.json(genUnAuthData());
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price: process.env.PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/report?canceled=true`,
            metadata: {
                userId: userInfo.userId,
            },
        });
        console.log('session.url', session.url)

        return NextResponse.json(genSuccessData(session))
    } catch (err) {
        return NextResponse.json(genErrorData('支付错误' + err.message));
    }
}
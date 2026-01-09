import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import CheckoutSession from '@/models/CheckoutSession';
const endpointSecret = process.env.WHSEC;
export async function POST(request) {

    let event;
    const text = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')
    try {
        event = stripe.webhooks.constructEvent(text, sig, endpointSecret);
        console.log('event.type', event.type);
        if (
            event.type === 'checkout.session.completed'
            || event.type === 'checkout.session.async_payment_succeeded'
        ) {
            fulfillCheckout(event.data.object);
        }
    } catch (err) {
        return new Response(`Webhook error: ${err.message}`, {
            status: 400,
        })
    }



    return new Response('Success!', {
        status: 200,
    })
}

async function fulfillCheckout(session) {
    const sessionId = session.id;
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys

    //console.log('Fulfilling Checkout Session ' + sessionId);
    await dbConnect();
    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID
    const cs = await CheckoutSession.findOne({ sessionId });
    if (cs && cs.isFullfilled) return;
    // TODO: Make sure fulfillment hasn't already been
    // performed for this Checkout Session

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
    });
    console.log('checkoutSession', checkoutSession.payment_status);
    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be performed
    if (checkoutSession.payment_status !== 'unpaid') {
        // TODO: Perform fulfillment of the line items
        //支付成功
        //console.log('支付成功', event.data.object);
        const userId = session.metadata.userId
        const user = await User.findOne({ userId });
        user.isLock = false;
        user.genStatus = 'waiting'
        await user.save();
        // TODO: Record/save fulfillment status for this
        // Checkout Session
        await CheckoutSession.create({
            sessionId,
            isFullfilled: true
        });
    }
}
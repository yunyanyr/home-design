import CountdownTimer from './CountdownTimer' // 假设CountdownTimer在同一目录下
import { stripe } from '@/lib/stripe'

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams
    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const {
        status,
        customer_details: { email: customerEmail }
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    return <CountdownTimer time={5} status={status} />
}
import mongoose from 'mongoose';

const checkoutSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    isFullfilled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
const CheckoutSession = mongoose.models.CheckoutSession || mongoose.model('CheckoutSession', checkoutSessionSchema);

export default CheckoutSession; 
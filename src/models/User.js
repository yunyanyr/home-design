import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        required: true,
        default: 'female'
    },
    birthDateTime: {
        type: Date,
        required: true,
        default: new Date(1996, 2, 12, 22)
    },
    email: {
        type: String,
        required: false,
    },
    isLock: {
        type: Boolean,
        required: true,
        default: true
    },
    genStatus: {
        type: String,
        enum: ['none', 'waiting', 'done'],
        required: false,
    },
    // provider: {
    //     type: String,
    //     enum: ['google', 'apple'],
    //     required: true,
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Modify Project references
UserSchema.virtual('projects', {
    ref: 'Project',
    localField: 'userId',
    foreignField: 'owner',
});

// Set options to allow virtual properties to be included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.models.User || mongoose.model('User', UserSchema); 
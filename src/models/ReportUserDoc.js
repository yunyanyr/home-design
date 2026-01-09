import mongoose from 'mongoose';

const reportUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    isDelete: {
        type: Number,
        default: 0
    },
    nianzhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    yuezhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    rizhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    shizhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    yunchengData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    jiajuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    mingLiData: {
        type: mongoose.Schema.Types.Mixed,
    },
    liuNianData: {
        type: mongoose.Schema.Types.Mixed,
    },
    jiajuProData: {
        type: mongoose.Schema.Types.Mixed,
    }
})
const ReportUserDoc = mongoose.models.ReportUserDoc || mongoose.model('ReportUserDoc', reportUserSchema);

export default ReportUserDoc; 
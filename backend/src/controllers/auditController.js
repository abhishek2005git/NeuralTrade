import Prediction from '../models/Prediction.js';

export const getAuditLogs = async (req, res) => {
    try {
        // Fetch last 50 completed predictions to show accuracy
        const logs = await Prediction.find({ status: 'completed' })
            .sort({ targetTime: -1 })
            .limit(50);

        // Calculate Overall System Accuracy
        const totalAccuracy = logs.reduce((acc, curr) => acc + curr.accuracyScore, 0);
        const globalScore = logs.length > 0 ? (totalAccuracy / logs.length).toFixed(2) : 0;

        res.json({ 
            logs, 
            globalScore,
            totalPredictions: logs.length 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch audit records" });
    }
};
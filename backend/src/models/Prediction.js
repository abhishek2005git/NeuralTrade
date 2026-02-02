import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  ticker: { type: String, required: true, uppercase: true },
  predictionPrice: { type: Number, required: true },
  startingPrice: { type: Number, required: true }, // Price at the time of prediction
  targetTime: { type: Date, required: true },      // When the price should hit
  actualPrice: { type: Number, default: null },    // Filled later by Cron
  accuracyScore: { type: Number, default: null },  // (100 - % error)
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Indexing for performance when fetching audit logs
predictionSchema.index({ ticker: 1, targetTime: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
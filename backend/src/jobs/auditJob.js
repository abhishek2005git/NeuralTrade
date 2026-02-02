import cron from 'node-cron';
import Prediction from '../models/Prediction.js';
import { fetchSparklineData } from '../services/marketService.js';

// Run every hour at the 5th minute
cron.schedule('5 * * * *', async () => {
  console.log('📡 AUDIT_JOB: Checking prediction accuracy...');

  const pending = await Prediction.find({ 
    status: 'pending', 
    targetTime: { $lt: new Date() } 
  });

  for (let pred of pending) {
    try {
      // 1. Fetch real historical price for the ticker
      const history = await fetchSparklineData(pred.ticker);
      const actualPrice = history[history.length - 1]; // Latest market price

      if (actualPrice) {
        // 2. Calculate Accuracy Score
        const error = Math.abs(actualPrice - pred.predictionPrice);
        const percentageError = (error / actualPrice) * 100;
        const accuracy = Math.max(0, 100 - percentageError).toFixed(2);

        // 3. Update the Audit Log
        pred.actualPrice = actualPrice;
        pred.accuracyScore = accuracy;
        pred.status = 'completed';
        await pred.save();
        
        console.log(`✅ Audit Complete for ${pred.ticker}: ${accuracy}% Accuracy`);
      }
    } catch (error) {
      console.error(`❌ Audit Failed for ${pred.ticker}:`, error.message);
    }
  }
});
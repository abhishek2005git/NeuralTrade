import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
    ticker: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true // Ensures "tsla" becomes "TSLA"
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    predictionData: [
        {
            date: String,
            price: Number
        }
    ]
});

// Use export default for the model
const Stock = mongoose.model('Stock', StockSchema);
export default Stock;
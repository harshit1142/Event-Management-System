const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    title: String,
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timezone: String, 
    startDateTime: Date,
    endDateTime: Date,
    logs: [{
        previousValue: Object,
        updatedValue: Object,
        updatedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true }); 
module.exports = mongoose.model('Event', eventSchema);
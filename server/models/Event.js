const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    profiles: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile' 
    }],
    startTime: {
         type: Date, required: true 
        },
    endTime: { type: Date, required: true },
    creatorTimezone: { type: String, required: true },
    logs: [{
        updatedAt: { type: Date, default: Date.now },
        diff: Object
    }]
}, { timestamps: true });
module.exports = mongoose.model('Event', EventSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timezone: { type: String, default: 'UTC' }
});
module.exports = mongoose.model('User', userSchema);
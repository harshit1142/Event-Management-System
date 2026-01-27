const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }
});
module.exports = mongoose.model('Profile', ProfileSchema);
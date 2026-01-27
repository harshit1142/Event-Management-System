const mongoose = require('mongoose');

const connectDB = async () => {
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        .then((conn) => console.log('Database Connected'))
        .catch((error) => console.log(error))
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;
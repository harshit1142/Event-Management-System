const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const productsRouter = require('./routes/products');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productsRouter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mannequin')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Mannequin API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

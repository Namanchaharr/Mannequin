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

// Redirect Route (High Speed)
const Redirect = require('./models/Redirect');

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        // Skip favicon or static assets if not handled
        if (code === 'favicon.ico') return res.status(404).end();

        const redirect = await Redirect.findOne({ code });
        if (redirect) {
            redirect.clicks++;
            await redirect.save();
            return res.redirect(301, redirect.destination);
        }

        // If no redirect found, maybe it's a 404 or just pass through for SPA? 
        // For now, simple 404
        res.status(404).json({ msg: 'Link not found' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

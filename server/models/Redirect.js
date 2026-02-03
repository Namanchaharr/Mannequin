const mongoose = require('mongoose');

const RedirectSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Redirect', RedirectSchema);

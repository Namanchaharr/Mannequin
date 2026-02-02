const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mannequin')
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const products = [
    {
        name: 'Oversized Trench',
        price: 129.99,
        description: 'A structural masterpiece defined by its exaggerated proportions and sharp tailoring. Crafted from premium bonded cotton, this trench features a storm flap and belted waist for a commanding silhouette.',
        image: '/mannequin1.png'
    },
    {
        name: 'Minimalist Blazer',
        price: 89.99,
        description: 'Stripped back to the essentials. This collarless blazer offers a clean, architectural line that frames the body without restriction. Essential wear for the modern purist.',
        image: '/mannequin2.png'
    },
    {
        name: 'Textured Knit',
        price: 59.99,
        description: 'Tactile luxury. A heavy-gauge knit with a unique raised pattern that catches the light. Designed for warmth without compromising on a sleek, fitted profile.',
        image: '/mannequin3.png'
    },
    {
        name: 'Silk Slip Dress',
        price: 110.00,
        description: 'Fluidity in motion. Bias-cut silk that drapes effortlessly over the form. A timeless piece that transitions seamlessly from day into the deepest night.',
        image: '/mannequin4.png'
    },
    {
        name: 'Structured Coat',
        price: 180.00,
        description: 'Rigid meets refined. Featuring strong shoulders and a nipped-in waist, this coat creates a powerful visual statement. The matte finish adds a touch of understated drama.',
        image: '/mannequin1.png'
    },
    {
        name: 'Leather Jacket',
        price: 250.00,
        description: 'Rebellious elegance. Soft, buttery leather cut in a moto style but stripped of excessive hardware. The focus is entirely on the quality of material and the precision of the fit.',
        image: '/mannequin2.png'
    },
    {
        name: 'Black Denim',
        price: 60.00,
        description: 'The foundation of the wardrobe. High-waisted, straight-leg denim in an intense, true black wash. Rigid construction that softens perfectly with wear.',
        image: '/mannequin3.png'
    },
    {
        name: 'Accessories Set',
        price: 35.00,
        description: 'Finishing touches. A curated collection of matte black geometric forms. Includes a structural choker and minimalist cuff to punctuate any look.',
        image: '/mannequin4.png'
    }
];

const seedDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    mongoose.disconnect();
};

seedDB();

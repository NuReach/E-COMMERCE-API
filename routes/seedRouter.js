import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get( '/' , async (req,res) => {
    try {
        await Product.deleteMany({});
        const products = await Product.insertMany(data.products);
        res.send({ message: 'Products seeded successfully', products });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Error seeding data' });
      }
})

export default seedRouter;
import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRoutes = express.Router();

seedRoutes.get( '/' , async (req,res) => {
    try {
        await Product.deleteMany({});
        const products = await Product.insertMany(data.products);
        res.send({ message: 'Products seeded successfully', products });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Error seeding data' });
      }
})
seedRoutes.get( '/user' , async (req,res) => {
  try {
      await User.deleteMany({});
      const users = await User.insertMany(data.users);
      res.send({ message: 'Users seeded successfully', users });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Error seeding data' });
    }
})
export default seedRoutes;
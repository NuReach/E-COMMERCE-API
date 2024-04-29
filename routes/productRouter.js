import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';

const productRoute = express.Router();

productRoute.get('/', async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error fetching products');
    }
  });

  productRoute.get('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error fetching product');
    }
  });

  productRoute.post('/', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
  
      const createdProduct = await newProduct.save();
      res.status(201).json(createdProduct); // Created (201) status for new resources
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error creating product'); // Internal Server Error (500) for generic errors
    }
  });

  productRoute.put('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Enforce validation rules on update
      });
  
      if (!updatedProduct) {
        return res.status(404).send('Product not found'); // Not Found (404) for missing product
      }
  
      res.json(updatedProduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error updating product');
    }
  });


  productRoute.delete('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).send('Product not found');
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error deleting product');
    }
  });

  productRoute.get('/get/categories', expressAsyncHandler (async (req, res) => {
    try {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({message : 'Error fetching categories' });
    }
  }));

  productRoute.get('/search/result', expressAsyncHandler (async (req, res) => {
    const query = req.query.query || 'all';
    const category = req.query.category || 'all';
    const min = req.query.min || 'all';
    const max = req.query.max ||  'all';
    const rating = req.query.rating || 'all';
    const order = req.query.order || 'newest';
    const page = req.query.page || 0;
    const limit = 6;
    try {
        const searchQuery = {};
        if (query !== 'all') {
          searchQuery.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ];
        }
        if (category !== 'all') {
          searchQuery.category = category;
        }
        if (min !== 'all' && max !== 'all') {
          searchQuery.price = { $gte: parseFloat(min), $lte: parseFloat(max) };
        }
        if (rating !== 'all') {
          searchQuery.rating = { $lte: parseFloat(rating) };
          }
        const count = await Product.countDocuments(searchQuery);
        const products = await Product.find(searchQuery)
        .sort(order !== 'newest' ? { createdAt: -1 } : {}) // Sort by order if provided
        .skip((page - 1) * limit)
        .limit(limit);
      res.send({ products, page, count , pages : Math.ceil(count/limit) });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({message : 'Error fetching categories' });
    }
  }));

  export default productRoute;
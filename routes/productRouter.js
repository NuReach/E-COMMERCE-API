import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error fetching products');
    }
  });

  productRouter.get('/:id', async (req, res) => {
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

  productRouter.post('/', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
  
      const createdProduct = await newProduct.save();
      res.status(201).json(createdProduct); // Created (201) status for new resources
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error creating product'); // Internal Server Error (500) for generic errors
    }
  });

  productRouter.put('/:id', async (req, res) => {
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


  productRouter.delete('/:id', async (req, res) => {
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

  export default productRouter;
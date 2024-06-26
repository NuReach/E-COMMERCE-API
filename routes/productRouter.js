import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils/isAuth.js';
import { isAdmin } from '../utils/IsAdmin.js';

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

  productRoute.post(
    '/create',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const newProduct = new Product({
        name: req.body.name,
        slug:  req.body.slug,
        image:  req.body.image,
        price:  req.body.price,
        category: req.body.category ,
        countInStock:  req.body.countInStock,
        rating: 0,
        numReviews: 0,
        description:  req.body.description,
      });
      const product = await newProduct.save();
      res.send({ message: 'Product Created', product });
    })
  );

  productRoute.put(
    '/update/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        await product.save();
        res.send({ message: 'Product Updated' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );


  productRoute.delete('delete/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).send({message:'Product not found'});
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({message :'Error deleting product'});
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
        .sort(order !== 'oldest' ? { createdAt: -1 } : {}) // Sort by order if provided
        .skip((page - 1) * limit)
        .limit(limit);
      res.send({ products, page, count , pages : Math.ceil(count/limit) });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({message : 'Error fetching categories' });
    }
  }));

  
  productRoute.get(
    '/admin/list',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
    const PAGE_SIZE = 3;
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRoute.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.cmt,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);


  export default productRoute;
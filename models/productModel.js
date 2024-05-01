import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
  },
  slug: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true, 
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0, 
  },
  rating: {
    type: Number,
    default: 0,
    min: 0, 
    max: 5, 
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0, 
  },
  reviews: [reviewSchema],
}, { timestamps: true }); 

const Product = mongoose.model("Product", productSchema);
export default Product;

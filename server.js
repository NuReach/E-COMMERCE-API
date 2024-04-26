import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log('Connect To DB');
})
.catch((err)=>{
  console.log(err.message);
})

const app = express();
const PORT = 3000;
app.use(cors());

app.use(`/api/seed`,seedRoutes);

app.use(`/api/products`,productRoutes);

app.use(`/api/users`,userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

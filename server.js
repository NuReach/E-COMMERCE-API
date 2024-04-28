import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/productRouter.js';
import seedRoutes from './routes/seedRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRouter from './routes/orderRouter.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log('Connect To DB');
})
.catch((err)=>{
  console.log(err.message);
})

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use(`/api/seed`,seedRoutes);

app.use(`/api/products`,productRoutes);

app.use(`/api/users`,userRoutes);

app.use(`/api/orders`,orderRouter);

app.get(`/api/key/paypal` , (req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

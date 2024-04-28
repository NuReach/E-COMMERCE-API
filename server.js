import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/productRouter.js';
import seedRoutes from './routes/seedRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRouter from './routes/orderRouter.js';
import path from 'path';

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

//const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname,'..', 'frontend', 'build', 'index.html'));
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ message: 'Something broke!' });
// });

app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

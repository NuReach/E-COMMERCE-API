import express from 'express';
import data from './data.js';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRouter.js';
import productRouter from './routes/productRouter.js';

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

app.use(`/api/seed`,seedRouter);

app.use(`/api/products`,productRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

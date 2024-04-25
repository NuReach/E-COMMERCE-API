import express from 'express';
import data from './data.js';
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(cors());

// Define a route for the "hello" API
app.get('/api/products', (req, res) => {
  res.send(data.products);
});
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((x)=>x.id == req.params.id);
    if (product) {
        res.send(product);
    }else{
        res.status(404).send({message:"Product Not <Found></Found>"})
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils/generateToken.js';


const userRoutes = express.Router();

userRoutes.get(
    '/',
    async (req, res) => {
      const users = await User.find({});
  
      if (req.user && req.user.isAdmin) {
        res.json(users);
      } else {
        res.status(403).send('Not authorized as admin');
      }
    });

  userRoutes.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error fetching user');
    }
  });

  userRoutes.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          });
          return;
        }
      }
      res.status(401).send({ message: 'Invalid email or password' });
    })
  );

export default userRoutes;

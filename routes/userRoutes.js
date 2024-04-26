import express from 'express';
import User from '../models/userModel.js';


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

export default userRoutes;

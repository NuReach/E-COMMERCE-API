import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';  
import { isAuth } from '../utils/isAuth.js';
import { isAdmin } from '../utils/IsAdmin.js';


const userRoutes = express.Router();

userRoutes.get(
    '/',
    async (req, res) => {
      const users = await User.find({});
  
      if (req.user && req.user.isAdmin) {
        res.json(users);
      } else {
        res.status(403).send({ message : 'Not authorized as admin'});
      }
    });
  

  userRoutes.get(
    '/allUsers/list',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const users = await User.find({});
      res.send(users);
    })
  );

  userRoutes.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );

  userRoutes.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        user.password = bcrypt.hashSync(req.body.password, 8);
        const updatedUser = await user.save();
        res.send({ message: 'User Updated', user: updatedUser });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );
  

  userRoutes.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send({ message : 'User Not Found'});
      }
  
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message : 'Error Querying Data'});
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

  userRoutes.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).send({ message: 'Email is already registered' });
        return;
      }
      const newUser = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 8),
        isAdmin: false,
      });
      await newUser.save();
      const token = generateToken(newUser);
      res.status(201).send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token,
      });
    })
  );

  userRoutes.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      try {
        const userId = req.user._id;
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).send({ message : 'User Not Found'});
        }

        if (req.body.current_password) {
          if (!bcrypt.compareSync(req.body.current_password, user.password)) {
            return res.status(400).send({message :'Current password is incorrect'});
          }
        }

        if (req.body.email && req.body.email !== user.email) {
          const existingUser = await User.findOne({ email: req.body.email });
          if (existingUser) {
            return res.status(400).send({ message : 'Email is already in use'});
          }
        }
  
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);
        }
  
        const updatedUser = await user.save();
  
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ message : 'Error Update Profile'});
      }
    })
  );

  userRoutes.delete(
    '/delete/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
      if (user) {
        if (user.email === 'admin@example.com') {
          res.status(400).send({ message: 'Can Not Delete Admin User' });
          return;
        }
        await user.deleteOne();
        res.send({ message: 'User Deleted' });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );

export default userRoutes;

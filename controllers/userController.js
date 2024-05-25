const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const userController = {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).send({ message: 'Email already created' });
      }
      const user = new User({ name, email, password });
      await user.save();
      const token = await user.GenerateAuthToken();

      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updates = req.body;

      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ error: 'Credentials invalid' });
      }
  
      const token = await user.GenerateAuthToken();
  
      res.status(200).send({ user, token });
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  },

  async getUserProfile(req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  async logoutUser(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });

      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
};

module.exports = userController;

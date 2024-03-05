import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).send({ error: 'Authorization header missing.' });
    }

    const tokenWithoutBearer = token.replace('Bearer ', '');
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id, 'tokens.token': tokenWithoutBearer });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired. Please authenticate again.' });
    }
    return res.status(401).send({ error: 'Authentication failed! Please authenticate.' });
  }
};

export default auth;

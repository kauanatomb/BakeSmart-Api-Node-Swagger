const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
  },
  tokens: [{ 
    token: 
    { type: String, 
      required: true } 
  }]
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.methods.GenerateAuthToken = async function () {
  const user = this;
  const JWT_SECRET = process.env.JWT_SECRET;
  const expiresIn = '1h';

  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn });

  const existingToken = user.tokens.find((t) => t.token === token);
  if (!existingToken) {
    user.tokens = user.tokens.concat({ token });
    await user.save();
  }

  return token;
};

module.exports = mongoose.model('User', userSchema);

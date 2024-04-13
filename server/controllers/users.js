const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');

const users = require('../models/users.js');

const userSignUpSchema = Joi.object({
  name: Joi.string().required().min(1),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
  password: Joi.string().required().min(8),
});

const userLoginSchema = Joi.object({
  email: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error: validateError } = userSignUpSchema.validate(req.body);
  if (validateError) {
    return res.status(400).json({ message: validateError.details[0].message });
  }

  try {
    const result = await users.findByEmail(email);
    if (result.length > 0) {
      return res.status(422).json({ message: 'Could not create user, user exists' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  const newUser = {
    id: v4(),
    name,
    email,
    password_hash: hashedPassword,
  };

  try {
    const result = await users.create(newUser);

    if (!result) {
      return res.status(500).json({ message: 'Something went wrong' });
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' },
    );

    return res.status(201).json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    );
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed, please try again' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error: validateError } = userLoginSchema.validate(req.body);
  if (validateError) {
    return res.status(400).json({ message: validateError.details[0].message });
  }

  let identifiedUser;
  try {
    const result = await users.findByEmail(email);
    if (!result[0]) {
      return res.status(401).json({ message: 'Could not identify user, credentials might be wrong' });
    }
    [identifiedUser] = result;
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  try {
    const valid = await bcrypt.compare(password, identifiedUser.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Could not identify user, credentials might be wrong' });
    }

    const token = jwt.sign(
      {
        id: identifiedUser.id,
        email: identifiedUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' },
    );

    return res.status(201).json(
      {
        id: identifiedUser.id,
        name: identifiedUser.name,
        email: identifiedUser.email,
        token,
      },
    );
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong with user login' });
  }
};

module.exports = {
  loginUser,
  signUpUser,
};

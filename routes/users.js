const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please include a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  // asynk anonymous function with paramaters for request and sresponse
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // don't assign user before checking if the same one exitsts
      let user = await User.findOne({ email });

      if (user) {
        // if the user already exists, return an error code and end the function
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password
      });

      // wait for bcrypt to complete before assigning to salt
      const salt = await bcrypt.genSalt(10);

      // wait for the hash before assigning password
      user.password = await bcrypt.hash(password, salt);

      // wait for the user to save before continuing
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

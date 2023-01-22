// backend/routes/api/users.js
const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('firstName')
    .isLength({ max: 255 })
    .withMessage('Please provide a first name that is 255 characters or less.'),
  check('lastName')
    .isLength({ max: 255 })
    .withMessage('Please provide a last name that is 255 characters or less.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 255 })
    .withMessage('Please provide a username between 4 and 255 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6, max: 255 })
    .withMessage('Password must be between 6 and 255 characters.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);
    const userObj = {id: user.id, firstName: user.firstName,
    lastName: user.lastName, email: user.email, username: user.username};

    return res.json(
      {user: userObj},
    );
  }
);

module.exports = router;

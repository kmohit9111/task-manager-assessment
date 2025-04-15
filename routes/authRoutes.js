// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { body } = require("express-validator");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").exists().withMessage("Password is required"),
  ],
  loginUser
);

module.exports = router;

const User = require('../Model/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Bus = require('../Model/DriverLocation')
const PASS = process.env.PASS;
const nodemailer = require('nodemailer');


// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidate = await bcrypt.compare(password, user.password);
    if (isValidate) {
      // Remove the password from the user object before sending it
      const { password, otp, ...userWithoutPassword } = user.toObject();

      const accessToken = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ accessToken, user: userWithoutPassword });
    } else {
      res.status(400).json({ message: "Enter valid Password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create the new user
    const newUser = new User({ email, password });
    await newUser.save();

    // Send success response
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate OTP for email verification
const getOtp = async (req, res) => {
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp; // Set OTP
    user.otpExpire = Date.now() + 3600000; // Set OTP expiry time (1 hour)

    await user.save();

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP for email verification is ${otp}.`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending verification OTP email:", error);
        return res.status(500).json({ message: "Failed to send verification OTP email" });
      }

      console.log("Verification OTP email sent");
      res.status(200).json({ message: "Verification OTP sent to email" });
    });

  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is expired
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if OTP matches
    if (user.otp === otp) {
      user.isVerified = true; // Mark the user as verified
      user.otp = null; // Clear the OTP after verification
      user.otpExpire = null; // Clear expiry time

      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

// Reset password functionality
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateOTP(); // OTP for password reset
    user.otp = token;
    user.otpExpire = Date.now() + 3600000; // Set expiry time

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Hello, use the following OTP to reset your password: ${token}`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending password reset email:", error);
        return res.status(500).json({ message: "Failed to send password reset email" });
      }

      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordConfirm = async (req, res) => {
  const { token, pwd } = req.body;
  if (!token || !pwd) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const user = await User.findOne({
      otp: token,
      otpExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    if (pwd.length < 6) {
      return res.status(400).json({ message: "Password is too short. It must be at least 6 characters long." });
    }
    const hashedPassword = await bcrypt.hash(pwd, 10);

    user.password = hashedPassword;
    user.otp = null; // Clear the OTP
    user.otpExpire = null; // Clear expiry time
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find(); // Fetch all buses from the database
    return res.status(200).json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    return res.status(500).json({ message: 'Error fetching buses' });
  }
};

module.exports = {
  register,
  login,
  getAllBuses,
  getOtp,
  verifyOtp,
  resetPasswordConfirm,
  resetPassword
};

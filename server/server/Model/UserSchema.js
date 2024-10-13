const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@srmist\.edu\.in$/, 'Please use a valid college email'],
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Initially, the email is not verified
  },
  otp: {
    type: String,
    default: null, // Default to null if no OTP is set
  },
  otpExpire: {
    type: Date,
    default: null, // Store OTP expiry time, default is null
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify OTP
userSchema.methods.verifyOtp = function (otp) {
  return this.otp === otp && this.otpExpire > Date.now(); // Check if the OTP matches and is not expired
};

const User = mongoose.model('User', userSchema);
module.exports = User;

const Admin = require('../Model/AdminSchema');
const Driver = require('../Model/DriverSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token (replace 'your_jwt_secret' with your actual secret key)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Send success response with token
    return res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Add a driver
const addDriver = async (req, res) => {
  try {
    const { username, password, busNo, phoneNumber } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newDriver = new Driver({
      username,
      password: hashedPassword, // Store the hashed password
      busNo,
      phoneNumber,
    });

    await newDriver.save();
    return res.status(201).json(newDriver);
  } catch (error) {
    console.error('Error adding driver:', error);
    return res.status(500).json({ message: 'Error adding driver' });
  }
};
  
  // Get all drivers
  const getDrivers = async (req, res) => {
    try {
      const drivers = await Driver.find();
      return res.status(200).json(drivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return res.status(500).json({ message: 'Error fetching drivers' });
    }
  };
  
  // Delete a driver
  const deleteDriver = async (req, res) => {
    try {
      const { id } = req.params;
      await Driver.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.error('Error deleting driver:', error);
      return res.status(500).json({ message: 'Error deleting driver' });
    }
  };

module.exports = {
  loginAdmin,
  deleteDriver,
  getDrivers,
  addDriver
};

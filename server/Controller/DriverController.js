const Driver = require('../Model/DriverSchema');
const Driverlocation = require('../Model/DriverLocation')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Driver login controller
const driverLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the driver exists
    const driver = await Driver.findOne({ username });
    if (!driver) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send token in response
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Add driver location
const addDriverLocation = async (req, res) => {
    try {
      const { busNo, location, time } = req.body;
  
      const newLocation = new Driverlocation({
        busNo,
        location,
        time,
      });
  
      await newLocation.save();
      return res.status(201).json(newLocation);
    } catch (error) {
      console.error('Error adding driver location:', error);
      return res.status(500).json({ message: 'Error adding driver location' });
    }
  };

module.exports = {
  driverLogin,
  addDriverLocation
};

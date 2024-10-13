const express = require('express');
const { loginAdmin,addDriver,getDrivers,deleteDriver } = require('../Controller/AdminController');

const router = express.Router();

// Admin login route
router.post('/login', loginAdmin);



// Add a driver
router.post('/add', addDriver);

// Get all drivers
router.get('/getalldriver', getDrivers);

// Delete a driver by ID
router.delete('/deletedriver/:id', deleteDriver);


module.exports = router;

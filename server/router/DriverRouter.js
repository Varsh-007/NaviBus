const express = require('express');
const { driverLogin ,addDriverLocation} = require('../Controller/DriverController');

const router = express.Router();

// Driver login route
router.post('/login', driverLogin);

router.post('/location',addDriverLocation)

module.exports = router;

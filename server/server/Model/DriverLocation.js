const mongoose = require('mongoose');

const driverLocationSchema = new mongoose.Schema({
  busNo: {
    type: String,
    required: true,
    lowercase: true, // Ensure busNo is stored in lowercase
  },
  location: {
     type:String,
     required: true
  },
  time: {
    type: Date,
    required: true,
  },
});

const DriverLocation = mongoose.model('DriverLocation', driverLocationSchema);
module.exports = DriverLocation;

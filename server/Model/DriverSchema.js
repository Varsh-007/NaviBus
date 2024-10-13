const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  busNo: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;

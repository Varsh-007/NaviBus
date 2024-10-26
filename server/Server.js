require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;
const bcrypt = require('bcrypt')
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });



// Middleware
app.use(cors());
app.use(express.json());

app.use('/admin',require('./router/AdminRouter'))
app.use('/driver',require('./router/DriverRouter'))
app.use('/user', require('./router/StudentRouter')); // Connect the user routes for registration and login


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const { getAllBuses } = require('../Controller/UserController');

const router = express.Router();

router.get('/getAll', getAllBuses);


router.route('/login').post(require('../Controller/UserController').login);
router.route('/register').post(require('../Controller/UserController').register);
router.route('/generate-otp').post(require('../Controller/UserController').getOtp);
router.route('/verify-otp').post(require('../Controller/UserController').verifyOtp);
router.route('/reset-password').post(require('../Controller/UserController').resetPassword);
router.route('/resetpass-otp').patch(require('../Controller/UserController').resetPasswordConfirm);

module.exports = router;

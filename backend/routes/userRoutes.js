const express= require('express');
const { LoginUser, loginStatus, logoutUser } = require('../controllers/userController');
const router= express.Router();


router.post('/login', LoginUser)
router.get("/loginstatus", loginStatus)
router.get("/logout", logoutUser)

module.exports= router;
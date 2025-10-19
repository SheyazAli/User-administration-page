const express = require("express");
const router = express.Router();
const userController = require('../controller/userController')
const middleware = require('../middleware/middleware')


router.get('/login',middleware.isLogin,userController.loadLogin)
router.post('/login',userController.login)


router.get('/register',middleware.isLogin,userController.loadRegister)
router.post('/register',userController.registerUser)

router.get('/home',middleware.checkSession,userController.loadHome)

router.get('/logout',middleware.checkSession,userController.logout)

module.exports = router
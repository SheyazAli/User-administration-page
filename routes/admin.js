const express = require("express");
const router = express.Router();
const adminController = require('../controller/adminController')
const adminMiddleware = require('../middleware/adminMiddleware')


router.get('/login',adminMiddleware.isLogin,adminController.loadLogin)
router.post('/login',adminController.login)

router.get('/dashboard',adminMiddleware.checkSession,adminController.loadDashboard)

router.post('/edit-user',adminMiddleware.checkSession,adminController.editUser)

router.get('/delete-user/:id',adminMiddleware.checkSession,adminController.deleteUser)

router.post('/edit-user',adminMiddleware.checkSession,adminController.editUser)

router.post('/add-user',adminController.addUser,adminMiddleware.checkSession)

router.get('/search-user',adminMiddleware.checkSession,adminController.searchUser)

router.get('/logout',adminMiddleware.checkSession,adminController.logout)



module.exports = router
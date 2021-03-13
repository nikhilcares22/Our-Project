const router = require('express').Router();
const Controller = require('../controllers/index')
const { Auth } = require('../middleware/index')

// Onboarding
router.post('/signup', Controller.Admin.signup);
router.post('/signin', Controller.Admin.signin);
router.put('/changePassword', Auth('isAdmin'), Controller.Admin.changePassword);
router.post('/resetPassword', Controller.Admin.resetPassword);
router.get('/verifyUser', Controller.Admin.verifyUser);
router.put('/changePass', Controller.Admin.changePassword)
// router.get('/getProfile', auth, Controller.AuthController.getProfile);
// router.put('/editProfile', auth, Controller.AuthController.editProfile);


module.exports = router;
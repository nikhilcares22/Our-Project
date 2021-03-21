const router = require('express').Router();
const Controller = require('../controllers/index')
const UploadService = require('../services/UploadService')
const { Auth } = require('../middleware/index')

// Onboarding
router.post('/signup', Controller.Admin.signup);
router.post('/signin', Controller.Admin.signin);
router.put('/changePassword', Auth('isAdmin'), Controller.Admin.changePassword);
router.post('/resetPassword', Controller.Admin.resetPassword);
router.get('/verifyUser', Controller.Admin.verifyUser);
router.put('/changePass', Controller.Admin.changePassword)
router.get('/getProfile', Auth('isAdmin'), Controller.Admin.getProfile);
router.put('/updateProfile', Auth('isAdmin'), Controller.Admin.updateProfile);
router.post('/test', UploadService.upload.single
    ('image'), Controller.Admin.test);

module.exports = router;
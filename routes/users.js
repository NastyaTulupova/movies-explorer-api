// файл маршрутов
const router = require('express').Router();
const { updateUserProfile, getCurrentUser } = require('../controllers/users');

// const {
//  validateUpdateUserProfile,
// } = require('../validation/validation');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserProfile);

module.exports = router;

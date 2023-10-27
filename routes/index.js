const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login, signout } = require('../controllers/users');
const authorization = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../validation/validation');

const ErrorNotFound = require('../errors/errorNotFound');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.post('/signout', signout);

// Роуты с защитой авторизацией
router.use(authorization);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('*', (reg, res, next) => {
  next(new ErrorNotFound('Произошла непредвиденная ошибка'));
});

module.exports = router;

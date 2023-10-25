const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // для хэширования пароля
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorAuthorization = require('../errors/errorAuthorization');
const ErrorValidation = require('../errors/errorValidation');
const ErrorSameEmail = require('../errors/errorSameEmail');
const ErrorNotFound = require('../errors/errorNotFound');

const { ValidationError } = mongoose.Error;

const { SUCCESS_CODE, SAME_OBJECT_CODE } = require('../codes/codes');

const { SECRET_KEY = 'tokenkey' } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // хешируем пароль
  bcrypt
    .hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      email,
      password: hashPassword, // записываем хеш в базу
    }))
    // Не передаём пароль в ответе
    .then(() => res.status(SUCCESS_CODE).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else if (err.code === SAME_OBJECT_CODE) {
        next(new ErrorSameEmail('Такой e-mail уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => next(err));
};

module.exports.updateUserProfile = (req, res, next) => {
  const newName = req.body.name;
  const newEmail = req.body.email;

  User.findByIdAndUpdate(
    req.user._id,
    { name: newName },
    { email: newEmail },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(
      () => new ErrorAuthorization('Пользователь с таким email-ом не найден'),
    )
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            // аутентификация успешна
            const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
              expiresIn: '7d',
            });
            res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            });
            // вернём токен
            res.send({ token });
          } else {
            throw new ErrorAuthorization('Неверный пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

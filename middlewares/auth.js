const jwt = require('jsonwebtoken');
const ErrorAuthorization = require('../errors/errorAuthorization');

const { NODE_ENV, SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    next(new ErrorAuthorization('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'tokenkey');
  } catch (err) {
    next(new ErrorAuthorization('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

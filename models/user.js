const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },

    email: {
      type: String,
      required: [true, 'email должен быть заполнен'],
      unique: [true, 'email должен быть уникальным'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неверный формат email',
      },
    },

    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },

  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);

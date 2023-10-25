const { ERROR_CONFLICT } = require('../codes/codes');

class ErrorSameEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CONFLICT;
  }
}

module.exports = ErrorSameEmail;

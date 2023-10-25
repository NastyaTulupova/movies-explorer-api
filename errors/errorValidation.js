const { ERROR_VALIDATION } = require('../codes/codes');

class ErrorValidation extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_VALIDATION;
  }
}

module.exports = ErrorValidation;

const { ERROR_AUTHORIZATION } = require('../codes/codes');

class ErrorAuthorization extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_AUTHORIZATION;
  }
}

module.exports = ErrorAuthorization;

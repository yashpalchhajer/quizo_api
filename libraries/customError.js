'use strict';

class CustomError extends Error {  

  constructor (message, code) {
      super(message);
      this.message = message;
      this.code = code;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
module.exports = CustomError;
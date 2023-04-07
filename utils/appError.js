class appError extends Error {
  constructor(message, statusCode) {
    //super calls the Error build in class which only takes message
    //also the Error class will set the message proprty to message value
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //404 =fail , 500 = error
    this.operationalError = true;

    //below is to not add this error to the error stack*
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appError;

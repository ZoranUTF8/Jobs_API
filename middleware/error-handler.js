const {
  StatusCodes
} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {


    let customError = {
      //? set default
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || "Something went wrong, please try again later..."
    }
    //? handling missing user input
    if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }

    //? handling with duplicate user values
    if (err.code && err.code === 11000) {
      customError.msg = `Account with that ${Object.keys(err.keyValue)} already exists`
      customError.statusCode = 400
    }
    //? handling with the cast error
    if (err.name === "CastError") {
      customError.msg = `Invalid input: ${err.value}`;
      customError.statusCode = StatusCodes.NOT_FOUND;
    }

      return res.status(customError.statusCode).json({
        msg: customError.msg
      })
    }

    module.exports = errorHandlerMiddleware
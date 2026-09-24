const notFound = (request, response, next) => {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` });
};

const errorHandler = (error, request, response, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    statusCode = 400;
    message = error.message;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({ message, error: error.name });
};

module.exports = { notFound, errorHandler };
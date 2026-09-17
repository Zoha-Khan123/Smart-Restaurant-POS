/**
 * Send a standardized JSON success response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} [data=null]
 * @param {number} [statusCode=200]
 */
export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const responseBody = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Send a standardized JSON error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array<any>} [errors=[]]
 * @param {number} [statusCode=400]
 */
export const sendError = (res, message = 'An error occurred', errors = [], statusCode = 400) => {
  const responseBody = {
    success: false,
    message
  };

  if (errors && errors.length > 0) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

export default {
  sendSuccess,
  sendError
};

import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, _next) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Centralized Error Handler Middleware
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
    errors = [{ field, message: `${field} already exists` }];
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier for ${err.path}`;
    errors = [{ field: err.path, message: 'Invalid ID format' }];
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // Production safety: conceal unknown 500 errors
  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected server error occurred';
    errors = [];
  }

  // Log error in development/non-test environment
  if (env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error('💥 Server Error:', err);
  }

  const responseBody = {
    success: false,
    message
  };

  if (errors.length > 0) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

export default errorHandler;

import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

/**
 * Validation middleware factory using Zod.
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {'body' | 'query' | 'params'} [source='body'] - Request property to validate
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));

        return sendError(res, 'Validation error', errors, 400);
      }
      next(error);
    }
  };
};

export default validate;

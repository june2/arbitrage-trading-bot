'use strict';

/**
 * Client Failures
 */
export const UNKNOWN_ENDPOINT = {
  statusCode: 404,
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.'
};

export const INVALID_REQUEST = {
  statusCode: 423,
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.'
};


/**
 * Server Errors
 */
export const INTERNAL_ERROR = {
  statusCode: 500,
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.'
};

export const UNKNOWN_ERROR = {
  statusCode: 500,
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.'
};

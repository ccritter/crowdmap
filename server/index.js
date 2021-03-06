#!/usr/server/env node

/**
 * Module dependencies.
 */
const WebSocket = require('ws');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');

/**
 * Create WS server.
 */
const wss = new WebSocket.Server({ port });
const osc = require('./osc')(wss);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

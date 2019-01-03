import winston from 'winston';
import moment from 'moment';
import fs from 'fs';
require('winston-daily-rotate-file');

const dir = 'logs'; // Create log folder 
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const transport_info = new (winston.transports.DailyRotateFile)({
  name: 'info',
  filename: './logs/info.log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info',
  json: false,
  timestamp: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
});

const transport_error = new (winston.transports.DailyRotateFile)({
  name: 'error',
  filename: './logs/error.log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: 'error',
  json: false,
  timestamp: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
});

let logger = null;

if (process.env.NODE_ENV !== 'production') {
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });
} else {
  logger = new (winston.Logger)({
    transports: [
      transport_info,
      transport_error
    ]
  });
}

module.exports = logger;

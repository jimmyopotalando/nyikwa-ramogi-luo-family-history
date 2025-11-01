// backend/utils/logger.js

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function getLogFilePath(logFileName) {
  return path.join(logsDir, logFileName);
}

function formatMessage(level, message) {
  return `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}\n`;
}

function info(message) {
  const formatted = formatMessage('info', message);
  process.stdout.write(formatted);
  fs.appendFile(getLogFilePath('app.log'), formatted, (err) => {
    if (err) console.error('Failed to write info log:', err);
  });
}

function error(message) {
  const formatted = formatMessage('error', message);
  process.stderr.write(formatted);
  fs.appendFile(getLogFilePath('error.log'), formatted, (err) => {
    if (err) console.error('Failed to write error log:', err);
  });
}

module.exports = {
  info,
  error,
};

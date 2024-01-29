const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'backend-service' },
    transports: [
        new winston.transports.File({ filename: 'backend.log' })
    ]
});

module.exports = logger;
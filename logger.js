import winston from 'winston';
const { combine, timestamp, prettyPrint, errors,  } = winston.format;



const logger = winston.createLogger({
    format: combine(
        errors({ stack: true }), // <-- use errors format
        timestamp(),
        prettyPrint()
    ),
    transports:[
        new winston.transports.File({ filename: './logs/logfile.log', level: 'warn' }),
        new winston.transports.Console({level:'warn'})
    ]
});
export default logger;
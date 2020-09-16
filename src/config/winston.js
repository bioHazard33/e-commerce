const winston = require('winston');

const options={
    file:{
        level:'info',
        filename:'src/logs/app.log',
        handleExceptions:true,
        json:true,
        maxSize:1048576, //10 MB
        maxFiles:5,
        colorize:true
    },
    console:{
        level:'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
}

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(options.console),
      new winston.transports.File(options.file)
    ],
    exitOnError:false
});

module.exports=logger
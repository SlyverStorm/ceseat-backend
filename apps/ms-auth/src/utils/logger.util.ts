import logger from 'pino';
import dayjs from 'dayjs';
import config from 'config';

const logLevel = config.get<string>("logger.logLevel");
const log = logger ({
    base:{
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD hh:mm:ss.SSS")}"`,
    transport:{
        target: 'pino-pretty'
    },
    level: logLevel
});

export default log;
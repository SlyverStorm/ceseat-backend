import dayjs from "dayjs";
import morgan from "morgan";

const morganLogger = morgan
morganLogger.token('id', () => {
    return `[${dayjs().format("YYYY-MM-DD hh:mm:ss.SSS")}] TRACE: `
})

export default morganLogger(':id :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
// DEPENDENCIES //
import * as logger from 'simple-node-logger'

/**
 * @author Pedro Augusto
 * @description Managment of logging.
 */
class Logger {
    public log: logger.Logger
    private level: string
    private allLevels: string[]

    public constructor () {
      this.log = logger.createSimpleLogger()
      this.allLevels = logger.Logger.STANDARD_LEVELS
      this.level = process.env.LOGGER_LVL
      this.log.setLevel(this.defineLoggerLvl())
    }

    /**
    * @description Determine the current log level from enviroment.
    * @returns The current log level.
    */
    private defineLoggerLvl (): logger.STANDARD_LEVELS {
      if (!this.allLevels.includes(this.level)) { return 'all' }
    }
}

export default new Logger().log

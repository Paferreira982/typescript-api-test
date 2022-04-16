import * as logger from 'simple-node-logger'

class Logger {
    public log: logger.Logger
    private level: string
    private allLevels: string[]

    public constructor () {
      // CONFIGURAÇÃO DO LOGGER //
      this.log = logger.createSimpleLogger()
      this.allLevels = logger.Logger.STANDARD_LEVELS
      this.level = process.env.LOGGER_LVL

      // CONFIGURAÇÃO DO NÍVEL DE LOGGER //
      this.log.setLevel(this.defineLoggerLvl())
    }

    private defineLoggerLvl (): logger.STANDARD_LEVELS {
      if (!this.allLevels.includes(this.level)) { return 'all' }
    }
}

export default new Logger().log

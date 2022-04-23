import express from 'express'
import router from './routes'
import cors from 'cors'
import DatabaseManager from './app/database/DatabaseManager'
import sequelize from './app/database/SequelizeConfig'
import decodeRoutes from './app/services/ExpressDecoder'

import log from './app/services/Logger'

/**
 * @author Pedro Augusto
 * @description Sets the initial configurations of the aplication.
 */
class App {
  public express: express.Application
  private endpoints: string[]

  public constructor () {
    log.info('[App] Initializing App.')

    this.express = express()
    this.endpoints = decodeRoutes()
    this.middlewares()
  }

  /**
  * @description Sets the middlewares dependencies in express instance.
  */
  private async middlewares (): Promise<void> {
    await this.database()

    this.express.use(express.json())
    this.express.use(router)
    this.express.use(cors())

    log.info('[App] App initialization completed.')
  }

  /**
  * @description Calls the database syncronizing and configuration methods.
  */
  private async database (): Promise<void> {
    await DatabaseManager.createDatabase()
    await sequelize.sync()
    await DatabaseManager.prepareDatabase(this.endpoints)
  }
}

export default new App().express

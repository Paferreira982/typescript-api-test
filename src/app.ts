import express from 'express'
import router from './routes'
import cors from 'cors'
import DatabaseManager from './app/database/DatabaseManager'
import sequelize from './app/database/SequelizeConfig'
import log from './app/services/Logger'

class App {
  public express : express.Application

  public constructor () {
    log.info('[App] Initializing App.')

    // CONFIGURAÇÕES DO EXPRESS //
    this.express = express()
    this.middlewares()
  }

  private async middlewares () : Promise<void> {
    // CONFIGURAÇÃO DO BANCO DE DADOS //
    await this.database()

    this.express.use(express.json())
    this.express.use(router)
    this.express.use(cors())

    log.info('[App] App initialization completed.')
  }

  private async database () : Promise<void> {
    await DatabaseManager.createDatabase()
    await sequelize.sync()
    await DatabaseManager.prepareDatabase()
  }
}

export default new App().express

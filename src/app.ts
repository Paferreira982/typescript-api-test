import express from 'express'
import cors from 'cors'
import DatabaseManager from './app/database/DatabaseManager'
import sequelize from './app/database/SequelizeConfig'
import log from './app/domains/Logger'

class App {
  public express : express.Application

  public constructor () {
    log.info('[App] Initializing App.')

    // CONFIGURAÇÃO DO BANCO DE DADOS //
    this.database()

    // CONFIGURAÇÕES DO EXPRESS //
    this.express = express()
    this.middlewares()

    log.info('[App] App initialization completed.')
  }

  private middlewares () : void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private async database () : Promise<void> {
    await DatabaseManager.createDatabase()
    await sequelize.sync()
    await DatabaseManager.prepareDatabase()
  }
}

export default new App().express

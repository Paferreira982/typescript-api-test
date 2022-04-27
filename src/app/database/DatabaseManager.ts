import Database from '../domains/Database'
import mariadb from 'mariadb'
import log from '../services/Logger'
import Profile from '../models/Profile'
import User from '../models/User'
import Action from '../models/Action'
import * as fs from 'fs'

/**
 * @author Pedro Augusto
 * @description Managment of default config to database.
 */
class DatabaseManager extends Database {
  /**
  * @description Create a database if not existis yet.
  */
  public async createDatabase (): Promise<void> {
    const pool = mariadb.createPool({
      host: this.host,
      user: this.dbUsername,
      password: this.dbPassword,
      connectionLimit: 5
    })

    let conn: mariadb.PoolConnection
    try {
      conn = await pool.getConnection()
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${this.name}`)
    } catch (err) {
      log.error(`[DatabaseManager] Error while connecting to database ${this.host}/${this.name}}.`)
    } finally {
      if (conn) conn.end()
      log.debug('[DatabaseManager] Database created or already exists.')
    }
  }

  /**
  * @description Prepare default user and roles for first instance of database.
  */
  public async prepareDatabase (endpoints: string[]): Promise<void> {
    const admin = await User.findAll()
    const profiles = await Profile.findAll()
    let prepared = true

    this.verifyEndpoints(endpoints)

    if (admin.length === 0 || profiles.length === 0) {
      prepared = false
      log.info('[DatabaseManager] Preparing database.')
    }

    // CRIANDO ACTIONS NA BASE DE DADOS //
    const newActions = await this.createActions()

    // CRIANDO PROFILE DEFAULT NA BASE DE DADOS //
    if (profiles.length === 0 || newActions) { await this.createDefaultProfile() }

    // CRIANDO USUÁRIO ADMINISTRADOR PADRÃO //
    if (admin.length === 0) { await this.createDefaultUser() }

    if (!prepared) log.info('[DatabaseManager] Database prepared.')
  }

  private verifyEndpoints (endpoints: string[]): void {
    const config = JSON.parse(fs.readFileSync(this.pathToActions, 'utf-8'))
    for (const i in endpoints) {
      let exist = false
      for (const j in config.actions) {
        if (endpoints[i] === config.actions[j].path) { exist = true; break }
      }

      if (!exist) {
        log.warn(`[DatabaseManager] Endpoint action '${endpoints[i]}' not in json config file.`)
      }
    }
  }

  private async createActions (): Promise<boolean> {
    const actions = await Action.findAll()
    const config = JSON.parse(fs.readFileSync(this.pathToActions, 'utf-8'))
    let newActions = []

    if (actions) {
      for (const i in config.actions) {
        let exist = false
        for (const j in actions) {
          if (config.actions[i].name === actions[j].name) { exist = true; break }
        }
        if (!exist && config.actions[i].auth) newActions.push(config.actions[i])
      }
    } else {
      newActions = [...config.actions]
    }

    if (newActions.length > 0) log.debug('[DatabaseManager] Creating actions.')

    newActions.forEach(async (config) => {
      const action = Action.build(config)
      await action.save()
    })

    return (newActions.length > 0)
  }

  private async createDefaultProfile (): Promise<void> {
    log.debug('[DatabaseManager] Creating/Updating default profile.')
    const profile = await Profile.findOrCreate({ where: { name: this.profile } })
    await profile[0].setActions(await Action.findAll())
  }

  private async createDefaultUser (): Promise<void> {
    log.debug('[DatabaseManager] Creating default user.')

    const profile = await Profile.findOne({ where: { name: this.profile } })
    await User.create({
      name: this.username,
      username: this.username,
      password: this.password,
      email: this.email,
      telephone: this.telephone
    })

    await User.findOne({ where: { username: this.username } }).then(async (user) => {
      await user.setProfile(profile)
    })
  }
}

export default new DatabaseManager()

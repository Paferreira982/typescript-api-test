import Database from '../domains/Database'
import mariadb from 'mariadb'
import log from '../services/Logger'
import Role from '../domains/Role'
import User from '../domains/User'

/**
 * @author Pedro Augusto
 * @description Managment of default config to database.
 */
class DatabaseManager extends Database {
  /**
  * @description Create a database if not existis yet.
  */
  public async createDatabase (): Promise<void> {
    log.debug('[DatabaseManager] Creating database if not exists.')
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
  public async prepareDatabase (): Promise<void> {
    log.info('[DatabaseManager] Preparing database.')

    // CRIANDO ROLES DEFAULT NA BASE DE DADOS //
    log.debug('[DatabaseManager] Creating default roles.')
    const roles = await Role.findAll()
    if (!roles || roles.length === 0) {
      this.roles.forEach(async (role: string) => {
        const obj = Role.build({ name: role })
        await obj.save()
      })
    }
    log.debug('[DatabaseManager] Default roles created.')

    // CRIANDO USUÁRIO ADMINISTRADOR PADRÃO //
    const admin = await User.findOne({ where: { name: this.username } })
    if (!admin) {
      log.debug('[DatabaseManager] Creating default user.')

      const role = await Role.findOne({ where: { name: this.roles[0] } })
      await User.create({
        name: this.username,
        username: this.username,
        password: this.password,
        email: this.email,
        telephone: this.telephone
      })

      await User.findOne({ where: { username: this.username } }).then((user) => {
        user.setRoles([role])
      }).finally(() => {
        log.debug('[DatabaseManager] Default user created.')
      }).catch((error) => {
        log.error(`[DatabaseManager] Error while creating default user: ${error}`)
      })
    }

    log.info('[DatabaseManager] Database prepared.')
  }
}

export default new DatabaseManager()

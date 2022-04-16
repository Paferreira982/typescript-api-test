import Database from '../domains/Database'
import mariadb from 'mariadb'
import log from '../domains/Logger'
import Role from '../models/Role'
import User from '../models/User'

class DatabaseManager extends Database {
  public async createDatabase () : Promise<void> {
    log.info('[DatabaseManager] Creating database if not exists.')
    const pool = mariadb.createPool({
      host: this.host,
      user: this.dbUsername,
      password: this.dbPassword,
      connectionLimit: 5
    })

    let conn : mariadb.PoolConnection
    try {
      conn = await pool.getConnection()
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${this.name}`)
    } catch (err) {
      log.error(`[DatabaseManager] Error while connecting to database ${this.host}/${this.name}}.`)
    } finally {
      if (conn) conn.end()
      log.info('[DatabaseManager] Database created or already exists.')
    }
  }

  public async prepareDatabase () : Promise<void> {
    log.info('[DatabaseManager] Preparing database.')

    // CRIANDO ROLES DEFAULT NA BASE DE DADOS //
    log.debug('[DatabaseManager] Creating default roles.')
    const roles = await Role.findAll()
    if (!roles || roles.length === 0) {
      this.roles.forEach(async (role : string) => {
        const obj = Role.build({ name: role })
        await obj.save()
      })
    }
    log.debug('[DatabaseManager] Default roles created.')

    // CRIANDO USUÁRIO ADMINISTRADOR PADRÃO //
    log.debug('[DatabaseManager] Creating default user.')
    const admin = await User.findOne({ where: { name: this.username } })
    if (!admin) {
      const role = await Role.findOne({ where: { name: this.roles[0] } })
      await User.create({
        name: this.username,
        username: this.username,
        password: this.password,
        email: this.email,
        telephone: this.telephone
      })
      User.findOne({ where: { username: this.username } }).then((user) => {
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

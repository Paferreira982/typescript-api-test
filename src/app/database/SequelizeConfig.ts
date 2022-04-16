import { Sequelize } from 'sequelize'
import Database from '../domains/Database'

class SequelizeConfig extends Database {
    public sequelize : Sequelize

    public constructor () {
      super()
      this.sequelize = new Sequelize(this.name, this.dbUsername, this.dbPassword, {
        dialect: 'mariadb',
        host: this.host,
        port: this.port,
        timezone: this.timeZone
      })
    }
}

export default new SequelizeConfig().sequelize
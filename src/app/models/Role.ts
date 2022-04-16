import Sequelize from 'sequelize'
import sequelize from '../database/SequelizeConfig'

const Role = sequelize.define('role', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

export default Role

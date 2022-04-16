import Sequelize from 'sequelize'
import sequelize from '../database/SequelizeConfig'
import PasswordSecurity from '../domains/PasswordSecurity'
import Role from './Role'

const User = sequelize.define('user', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set (password : string) {
      this.setDataValue('password', PasswordSecurity.hash(password))
    }
  },

  email: {
    type: Sequelize.STRING,
    unique: true
  },

  telephone: {
    type: Sequelize.STRING,
    unique: true
  }
})

User.belongsToMany(Role, { through: 'users_roles' })
Role.belongsToMany(User, { through: 'users_roles' })

export default User

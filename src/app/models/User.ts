import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'
import PasswordSecurity from '../domains/PasswordSecurity'
import Role from './Role'

class User extends Model {
  declare id: number
  declare name: string
  declare username: string
  declare password: string
  declare email: string | null
  declare telephone: string | null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRoles: any
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set (password : string) {
        this.setDataValue('password', PasswordSecurity.hash(password))
      }
    },

    email: {
      type: DataTypes.STRING,
      unique: true
    },

    telephone: {
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    tableName: 'users',
    sequelize
  })

User.belongsToMany(Role, { through: 'users_roles' })
Role.belongsToMany(User, { through: 'users_roles' })

export default User

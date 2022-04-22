// DEPENDENCIES //
import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'

// INTERFACES //
import { IUser } from '../domains/interfaces/IUser'

// SERVICES //
import PasswordSecurity from '../services/security/PasswordSecurity'

// DOMAINS //
import Profile from './Profile'

/**
 * @author Pedro Augusto
 * @description Sets properties for Sequelize.
 */
class User extends Model implements IUser {
  declare id: number
  declare name: string
  declare username: string
  declare password: string
  declare email: string | null
  declare telephone: string | null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProfile: any
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
      set (password: string) {
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
  }
)

User.belongsTo(Profile)

export default User

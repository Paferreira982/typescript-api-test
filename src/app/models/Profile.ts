import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'

import Action from './Action'

/**
 * @author Pedro Augusto
 * @description Sets properties for Sequelize.
 */
class Profile extends Model {
  declare id: number
  declare name: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActions: any
}

Profile.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'profiles',
    sequelize
  }
)

Profile.belongsToMany(Action, { through: 'profiles_actions' })
Action.belongsToMany(Profile, { through: 'profiles_actions' })

export default Profile

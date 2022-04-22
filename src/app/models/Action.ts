import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'

/**
 * @author Pedro Augusto
 * @description Sets properties for Sequelize.
 */
class Action extends Model {
  declare id: number
  declare name: string
  declare path: string
}

Action.init(
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
    },

    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'actions',
    timestamps: false,
    sequelize
  }
)

export default Action

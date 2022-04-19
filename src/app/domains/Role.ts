// DEPENDENCIES //
import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'

/**
 * @author Pedro Augusto
 * @description Sets properties for Sequelize.
 */
class Role extends Model {
  declare id: number
  declare nome: string
}

Role.init(
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
    tableName: 'roles',
    sequelize
  })

export default Role

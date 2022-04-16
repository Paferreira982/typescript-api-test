import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/SequelizeConfig'

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

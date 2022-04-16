import User from './User'
import Role from './Role'
import { ModelCtor, Model } from 'sequelize'
import sequelize from '../database/SequelizeConfig'
import log from '../domains/Logger'

class Models {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private models : Array<ModelCtor<Model<any, any>>>

    public constructor () {
      this.models = [User, Role]
    }

    public async sync () : Promise<void> {
      log.info('[Models] Synchronizing database.')
      this.models.forEach(async (model) => {
        await model.sync()
      })
      await sequelize.sync()
    }
}

export default new Models()

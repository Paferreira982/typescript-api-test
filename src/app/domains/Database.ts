/**
 * @author Pedro Augusto
 * @description Prepares variables for the database from environment.
 */
class Database {
    // DATABASE CONFIGURATION VARIABLES //
    protected name: string
    protected dbUsername: string
    protected dbPassword: string
    protected host: string
    protected port: number
    protected timeZone: string

    // DATABASE DEFAULT USER CONFIGURATION VARIABLES //
    protected username: string
    protected password: string
    protected email: string
    protected telephone: string

    // OUTRAS CONFIGURAÇÕES //
    protected profile = 'Administrador do sistema'
    protected pathToActions = './src/app/config/actions.json'
    protected notRequireAuthPaths = ['auth']
    protected rootPath = 'ritter/api/'

    public constructor () {
      // SETTING DATABASE VARIABLES //
      this.name = process.env.DB_NAME || 'ritter'
      this.dbUsername = process.env.DB_USER || 'root'
      this.dbPassword = process.env.DB_PASSWORD || 'admin123'
      this.host = process.env.DB_URL || 'localhost'
      this.port = parseInt(process.env.DB_PORT) || 3306
      this.timeZone = process.env.DB_TZ || 'America/Sao_Paulo'

      // SETTING DEFAULT USER VARIABLES //
      this.username = process.env.USER_NAME || 'admin'
      this.password = process.env.USER_PASSWORD || 'admin123'
      this.email = process.env.USER_EMAIL || 'contato@paferreira.com'
      this.telephone = process.env.USER_TEL || '21992540982'
    }
}

export default Database

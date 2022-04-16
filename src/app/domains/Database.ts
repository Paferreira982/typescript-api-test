class Database {
    // VARIÁVEIS DE CONFIGURAÇÃO DO BANCO DE DADOS //
    protected name: string
    protected dbUsername: string
    protected dbPassword: string
    protected host: string
    protected port: number
    protected timeZone: string

    // VARIÁVEIS DE CONFIGURAÇÃO DE USUÁRIO DEFAULT DO BANCO DE DADOS //
    protected username: string
    protected password: string
    protected email: string
    protected telephone: string
    protected roles: string[]

    public constructor () {
      // CONFIGURANDO VARIÁVEIS DO BANCO //
      this.name = process.env.DB_NAME || 'ritter'
      this.dbUsername = process.env.DB_USER || 'root'
      this.dbPassword = process.env.DB_PASSWORD || 'admin123'
      this.host = process.env.DB_URL || 'localhost'
      this.port = parseInt(process.env.DB_PORT) || 3306
      this.timeZone = process.env.DB_TZ || 'America/Sao_Paulo'

      // CONFIGURANDO VARIÁVEIS DO USUÁRIO DEFAULT //
      this.username = process.env.USER_NAME || 'admin'
      this.password = process.env.USER_PASSWORD || 'admin123'
      this.email = process.env.USER_EMAIL || 'contato@paferreira.com'
      this.telephone = process.env.USER_TEL || '21992540982'
      this.roles = ['ROLE_ADMIN', 'ROLE_USER']
    }
}

export default Database

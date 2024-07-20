import swaggerJsdoc, { Options } from 'swagger-jsdoc'
import envConfig from './env.config.js'

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Comic API',
      description: 'API for comic books',
      version: '1.0.0',
      contact: {
        name: 'Đỗ Công Sơn',
        email: 'sonanhson99@gmail.com',
        url: 'https://docongson.netlify.app'
      },
      license: {
        url: 'https://opensource.org/licenses/MIT',
        name: 'MIT'
      }
    },
    host: `localhost:${envConfig.port}`,
    basePath: '/api/v1',
    servers: [
      {
        url: `http://localhost:${envConfig.port}/api/v1`,
        description: 'Development server'
      },
      {
        url: `http://product/api/v1`,
        description: 'Production'
      }
    ]
  },
  apis: ['src/routes/v1/*.ts', 'src/routes/*.yml']
}
export const swaggerDocs = swaggerJsdoc(swaggerOptions)

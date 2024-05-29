declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT: string
      MONGO_URI: string
      SESSION_SECRET: string
      COOKIE_PASSWORD: string
      ADMIN_EMAIL: string
      ADMIN_PASSWORD: string
      JWT_SECRET: string
      JWT_ACCESS_EXPIRATION_MINUTES: string
      JWT_REFRESH_EXPIRATION_DAYS: string
      JWT_RESET_PASSWORD_EXPIRATION_MINUTES: string
      JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: string
    }
  }
}

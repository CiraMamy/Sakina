export const configuration = () => ({
  port: Number(process.env.PORT ?? 3000),
  apiVersion: 'v1',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://sakina:sakina_dev_password@localhost:5432/sakina',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET ?? 'replace_me',
    sessionSecret: process.env.SESSION_SECRET ?? 'replace_me',
  },
});

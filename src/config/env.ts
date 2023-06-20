import * as dotenv from 'dotenv';
dotenv.config();
export default {
  api_key: process.env.API_KEY,
  app: {
    host: process.env.APP_HOST,
    port: +process.env.APP_PORT,
  },
  database: {
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
  },
  dk: {
    x_api_key: process.env.DK_X_API_KEY,
    appsync_url: process.env.DK_APPSYNC_URL,
  },
  notification: {
    mailer_url: process.env.NOTIFICATION_MAILER_URL,
    mailer_username: process.env.NOTIFICATION_MAILER_USERNAME,
    mailer_x_api_key: process.env.NOTIFICATION_MAILER_X_API_KEY,
    sms_url: process.env.NOTIFICATION_SMS_URL,
    sms_x_api_key: process.env.NOTIFICATION_SMS_X_API_KEY,
  },
  scraper_api_key: process.env.SCRAPER_API_KEY,
  dentalkart_product_api_key: process.env.DENTALKART_PRODUCT_API_KEY,
  dentalkart_product_api_url:
    'https://serverless-prod.dentalkart.com/api/v1/product-data',
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket_name: 'dkart-pricecomparison',
  },
  secrets: {
    access_token_secret:
      process.env.ACCESS_TOKEN_SECRET || '2TW2j6835y6F5MX8fp2e',
    refresh_token_secret:
      process.env.REFRESH_TOKEN_SECRET || 'ZILh40OulJGJY89b4M7l9F7OyZyy76Q0Jg',
  },
  redis_uri: process.env.REDIS_URI,
};

declare const _default: {
    api_key: string;
    app: {
        host: string;
        port: number;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        dialect: string;
    };
    dk: {
        x_api_key: string;
        appsync_url: string;
    };
    notification: {
        mailer_url: string;
        mailer_username: string;
        mailer_x_api_key: string;
        sms_url: string;
        sms_x_api_key: string;
    };
    scraper_api_key: string;
    dentalkart_product_api_key: string;
    dentalkart_product_api_url: string;
    aws: {
        access_key_id: string;
        secret_access_key: string;
        bucket_name: string;
    };
    secrets: {
        access_token_secret: string;
        refresh_token_secret: string;
    };
    redis_uri: string;
};
export default _default;

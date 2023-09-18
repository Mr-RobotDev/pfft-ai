declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;
    TWITTER_ID: string;
    TWITTER_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    AUTH0_ID: string;
    AUTH0_SECRET: string;
    PFFT_AI_API_URL: string;
    MONGO_URL: string;
    NEXTAUTH_UR_BLOG: string;
    SECRET: string;
    ENCRYPT_PRIVATE_KEY: string;
    EMS_MONGO_URL: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    MONTHLY_PAYMENT_AMOUNT_1000_CREDIT: number;
    MONTHLY_PAYMENT_AMOUNT_2000_CREDIT: number;
    FREE_CREDIT_AMOUNT: number;
    DEDUCTED_AMOUNT_FROM_CREDIT: number;
    VAT_TAX: number;
    NEXT_PUBLIC_STRIPE_API_VERSION: string;
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
    IS_PRODUCTION: boolean;
  }
}

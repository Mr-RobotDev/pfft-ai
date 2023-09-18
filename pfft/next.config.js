/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ENCRYPT_PRIVATE_KEY: process.env.ENCRYPT_PRIVATE_KEY,
    MONTHLY_PAYMENT_AMOUNT_1000_CREDIT:
      process.env.MONTHLY_PAYMENT_AMOUNT_1000_CREDIT,
    MONTHLY_PAYMENT_AMOUNT_2000_CREDIT:
      process.env.MONTHLY_PAYMENT_AMOUNT_2000_CREDIT,
    VAT_TAX: process.env.VAT_TAX,
    IS_PRODUCTION: process.env.IS_PRODUCTION,
  },
});

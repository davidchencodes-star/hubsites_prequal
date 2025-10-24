import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SITE_URL: process.env.SITE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    POSTMARK_TOKEN: process.env.POSTMARK_TOKEN,
    DEBUG_ENABLED: process.env.DEBUG_ENABLED
  },
};

export default nextConfig;

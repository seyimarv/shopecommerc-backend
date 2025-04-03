import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

if (!paystackSecretKey) {
  throw new Error("PAYSTACK_SECRET_KEY is required");
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  plugins: [
    // {
    //   resolve: "medusa-payment-paystack",
    //   options: {
    //     secret_key: process.env.PAYSTACK_SECRET_KEY,
    //   },
    // },
  ],
  modules: [
    {
      resolve: "./src/modules/announcement",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/paystack",
            id: "paystack",
            options: {
              secret_key: paystackSecretKey,
              debug: true,
            },
          },
        ],
      },
    },
  ],
});

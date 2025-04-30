import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const isProduction = process.env.NODE_ENV === "production";

if (!paystackSecretKey) {
  throw new Error("PAYSTACK_SECRET_KEY is required");
}

const baseModules = {
  announcement: {
    resolve: "./src/modules/announcement",
  },
  restock: {
    resolve: "./src/modules/restock",
  },
  // algolia: {
  //   resolve: "./src/modules/algolia",
  //   options: {
  //     appId: process.env.ALGOLIA_APP_ID!,
  //     apiKey: process.env.ALGOLIA_API_KEY!,
  //     productIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME!,
  //   },
  // },
};

const productionConfig = {
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true" || false,
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  projectConfig: {
    workerMode:
      process.env.WORKER_MODE as "shared" | "worker" | "server" || "shared",
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  plugins: [],
  modules: {
    ...baseModules,
    cacheService: {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    eventBus: {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    workflowEngine: {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
    notification: {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
            {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
    file: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
    payment: {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/paystack",
            id: "paystack",
            options: {
              secret_key: paystackSecretKey,
              debug: false,
            },
          },
        ],
      },
    },
  },
};

const developmentConfig = {
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
  ],
  modules: {
    ...baseModules,
    notification: {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
    file: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
          },
        ],
      },
    },
    payment: {
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
  },
};

const configToExport = isProduction ? productionConfig : developmentConfig;

module.exports = defineConfig(configToExport);

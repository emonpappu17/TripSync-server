// import { defineConfig, env } from "@prisma/config";
// import "dotenv/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   // schema: "prisma/schema",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });


import { defineConfig, env } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

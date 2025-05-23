// import fs from "fs";
// import swaggerJsDoc, { Options } from "swagger-jsdoc";
// import { version } from "../../../../package.json";
// import { customEnvs } from "../env";

// const description = fs.readFileSync("src/lib/docs/description.md").toString();

// const swagger: Options = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       version,
//       description,
//       title: `Url Shorten`,
//       contact: { name: "Amodu Ayomide", email: "ayomidesherif2019@gmail.com" },
//       servers: [{ url: `http://localhost:${customEnvs.port}/api/v1` }],
//       license: {
//         name: " Apache 2.0",
//         url: "http://www.apache.org/licenses/LICENSE-2.0.html",
//       },
//     },
//   },
//   apis: ["./src/lib/docs/*/*.yml", "./src/lib/docs/*.yml"],
// };

// export const config = swaggerJsDoc(swagger);

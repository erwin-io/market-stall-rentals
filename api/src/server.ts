/** source/server.ts */
import * as http from "http";
import { Express } from "express";
import express = require("express");
import * as path from "path";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import * as typeOrmConfig from "./db/typeorm";
import { usersRouter } from "./controllers/users";
import { rolesRouter } from "./controllers/roles";
import * as cors from "cors";

const app: Express = express();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', 'https://market-stall-rentals-web.vercel.app'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

// Then pass these options to cors:
app.use(cors());

/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

// Parsing the env file.
if (!process.env.NODE_ENV) {
  dotenv.config({ path: path.resolve(__dirname, "./envs/development.env") });
}
const dbConfig = typeOrmConfig.createConfig();

createConnection(dbConfig)
  .then(async (connection) => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));


/** Routes */
const routePrefix = "api/";
app.use("/" + routePrefix + "users", usersRouter);
app.use("/" + routePrefix + "roles", rolesRouter);
/** Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
  console.log(
    `The server is running on port ${PORT} use this link http://localhost:${PORT}/${routePrefix}`,
  ),
);

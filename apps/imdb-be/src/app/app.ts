import * as express from 'express';
import connectDB from '../services/config/db';
import router from '../routes/routes';
import session = require('express-session');
import * as cors from "cors"
import { corsOptions } from '../utils/static';
import * as cookieParser from "cookie-parser"
import { serve, setup } from "swagger-ui-express"
import * as swaggerDocument from "./swagger.json"

export const createApp = () => {

  connectDB();
  const app = express();
  app.use(cors(corsOptions))

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set("trust proxy", 1)
  app.use(cookieParser())
  app.use(session({
    name: "session",
    secret: process.env.NX_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: app.get("env") === 'production',
      maxAge: 1000 * 60 * 60 * 3
    }
  }))

  app.use("/api", router);
  app.use("/api-docs", serve)
  app.get("/api-docs", setup(swaggerDocument))
  return app
}


import * as express from 'express';
import connectDB from '../services/config/db';
import router from '../routes/routes';
import session = require('express-session');
import * as cors from 'cors';
import { corsOptions } from '../utils/static';
import { serve, setup } from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import { socket } from '../services/config/socketService';
import { createServer } from 'http';
import { syncWithAlgolia } from '../services/config/algoliaService';

export const createApp = () => {
  connectDB();

  const app = express();
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1);
  // app.use(cookieParser())
  app.use(
    session({
      name: 'session',
      secret: process.env.NX_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: true,
      },
    })
  );

  app.use('/api', router);
  app.use('/api-docs', serve);
  app.get('/api-docs', setup(swaggerDocument));
  return app;
};
export const createAppWithSockets = () => {
  connectDB();

  const app = express();
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1);
  app.use(
    session({
      name: 'session',
      secret: process.env.NX_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: true,
      },
    })
  );

  app.use('/api', router);
  app.use('/api-docs', serve);
  app.get('/api-docs', setup(swaggerDocument));

  socket(app)
  syncWithAlgolia()
  return app;
};




import IAuth from "./types/Auth/authTypes"


declare module 'express-session' {
  interface SessionData {
    user?: IAuth;
  }
}
declare namespace Express {
  export interface Request {
    user?: IAuth
  }
}

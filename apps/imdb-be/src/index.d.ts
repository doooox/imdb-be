import IAuth from "./types/Auth/authTypes"


declare module 'express-session' {
  interface SessionData {
    user?: IAuth;
  }
}

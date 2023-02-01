import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}

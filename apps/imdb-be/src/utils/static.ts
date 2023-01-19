import * as cors from "cors"

export const corsOptions: cors.CorsOptions = {
  origin: process.env.NX_FE_URL || "*",
  credentials: true,
  preflightContinue: true
}

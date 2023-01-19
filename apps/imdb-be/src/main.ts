import { createApp } from "./app/app"

const port = process.env.NX_PORT || 3333;
const app = createApp()

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

import { createAppWithSockets } from "./app/app"

const port = process.env.NX_PORT || 3333;
const app = createAppWithSockets()

const server = app.listen(port, () => {
  (`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

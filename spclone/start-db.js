const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

const port = 3000; // Change this port if needed

server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running at http://localhost:${port}`);
});

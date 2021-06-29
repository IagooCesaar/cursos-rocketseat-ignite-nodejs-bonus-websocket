import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket"
  })
})

server.listen(3000, () => {
  console.log("App is running on port 3000🚀")
})
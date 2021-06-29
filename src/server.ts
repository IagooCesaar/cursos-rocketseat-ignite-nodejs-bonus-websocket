import { createServer } from 'http'
import path from 'path'
import express from 'express'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("soket", socket)
})

app.use(express.static(path.join(__dirname,"..", "public")))

app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket"
  })
})

server.listen(3000, () => {
  console.log("App is running on port 3000🚀")
})
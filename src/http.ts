import express from 'express'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  // Aqui o serviço é inicializado
  console.log("socket", socket.id)
})

app.use(express.static(path.join(__dirname,"..", "public")))
app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket 😊"
  })
})

export { server, io }
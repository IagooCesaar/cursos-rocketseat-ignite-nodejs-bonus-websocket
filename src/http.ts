import "reflect-metadata"
import express from 'express'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

const app = express();
const server = createServer(app);
const io = new Server(server);

//mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
mongoose.connect("mongodb://localhost:27017/rocketsocket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

io.on("connection", (socket) => {
  // Aqui o serviço é inicializado
  console.log("🔌 Nova conexão socket", socket.id)
})

app.use(express.static(path.join(__dirname,"..", "public")))
app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket 😊"
  })
})

export { server, io }
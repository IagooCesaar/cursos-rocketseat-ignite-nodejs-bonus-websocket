import { io } from '../http'

// socket.emit() -> envio direcionado a um grupo de conexões
// io.emit() -> broadcast
io.on("connect", socket => {
  // recuperando dados da conexão (evento "on connection")
  socket.emit("chat_iniciado", {
    message: "Seu chat foi iniciado"
  })
})
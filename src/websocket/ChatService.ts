import { container } from 'tsyringe'
import { io } from '../http'
import { CreateUserService } from '../services/CreateUserServices'

// socket.emit() -> envio direcionado a um grupo de conexões
// io.emit() -> broadcast
// socket.on() -> evento para "ouvir" 
io.on("connect", socket => {
  // recuperando dados da conexão (evento "on connection")
  socket.on("start", async (data) => {
    const { email, avatar, name } = data;
    const socket_id = socket.id;
    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({
      avatar,
      email,
      name,
      socket_id,
    })
    console.log(user)
  })
})
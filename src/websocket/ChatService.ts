import { container } from 'tsyringe'
import { io } from '../http'
import { CreateChatRoomService } from '../services/CreateChatRoomService'
import { CreateUserService } from '../services/CreateUserService'
import { GetAllUsersService } from '../services/GetAllUsersService'
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService'
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService'

// socket.emit() -> envio direcionado a um grupo de conexões
// socket.broadcast.emit() -> envia para todos os usuário, exceto para o próprio remetente
// io.emit() -> broadcast para todos usuários
// socket.on() -> evento para "ouvir" 

io.on("connect", socket => {
  // recuperando dados da conexão (evento "on connection")

  socket.on("start", async (data) => {
    // "start" é emitido pelo frontend
    const { email, avatar, name } = data;
    const socket_id = socket.id;
    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({
      avatar,
      email,
      name,
      socket_id,
    })
    //Enviando usuário para todos os outros conectados
    socket.broadcast.emit("new_users", user);
  })

  socket.on("get_users", async (callback) => {
    // "get_users" é emitido pelo frontend para obter lista de usuário
    const getAllUsersService = container.resolve(GetAllUsersService)
    const users = await getAllUsersService.execute();
    callback(users)
  })

  socket.on("start_chat", async (data, callback) => {
    const { idUser } = data;
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const userLogged = await getUserBySocketIdService.execute(socket.id);

    const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
    let room = await getChatRoomByUsersService.execute([
      idUser,
      userLogged._id,
    ]);

    if(!room) {
      const createChatRoomService = container.resolve(CreateChatRoomService);
      room = await createChatRoomService.execute([
        idUser,
        userLogged._id,
      ]);
    }
    socket.join(room.idChatRoom)
    callback(room)
  })
})
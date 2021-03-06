import { container } from 'tsyringe'
import { io } from '../http'
import { CreateChatRoomService } from '../services/CreateChatRoomService'
import { CreateMessageService } from '../services/CreateMessageService'
import { CreateUserService } from '../services/CreateUserService'
import { GetAllUsersService } from '../services/GetAllUsersService'
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService'
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService'
import { GetMessagesByChatRoomIdService } from '../services/GetMessagesByChatRoomIdService'
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService'

// socket.emit() -> envio direcionado a um grupo de conexões
// socket.broadcast.emit() -> envia para todos os usuário, exceto para o próprio remetente
// socket.on() -> evento para "ouvir" 
// io.emit() -> broadcast para todos usuários
// io.to() -> envio para um socket id específico

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
    const getMessagesByChatRoomIdService = container.resolve(GetMessagesByChatRoomIdService);
    const messages = await getMessagesByChatRoomIdService.execute(room.idChatRoom);

    socket.join(room.idChatRoom)
    callback({ room, messages })
  })

  socket.on("message", async (data) => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const userLogged = await getUserBySocketIdService.execute(socket.id);

    const createMessageService = container.resolve(CreateMessageService);
    const message = await createMessageService.execute({
      to: userLogged._id,
      roomId: data.idChatRoom,
      text: data.message
    })

    //envia mensagem para todos os membros da sala
    io.to(data.idChatRoom).emit("message", {
      message,
      user: userLogged,
    })

    //envia notificação para usuário destinatário    
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);
    const room = await getChatRoomByIdService.execute(data.idChatRoom);
    const recipientUser = room.idUsers.find(user => user.id !== userLogged.id);
    io.to(recipientUser.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: userLogged
    })
  })
})
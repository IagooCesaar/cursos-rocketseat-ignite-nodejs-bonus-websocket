import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
class GetMessagesByChatRoomIdService {
  async execute(roomId: string) {
    //retorna mensagens e dados de respect. usuários
    const messages = await Message.find({
      roomId
    }).populate("to").exec();
    return messages;
  }
}

export { GetMessagesByChatRoomIdService } 
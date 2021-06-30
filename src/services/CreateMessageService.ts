import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

interface CreateMessageDTP {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
class CreateMessageService {
  async execute({
    roomId,
    text,
    to
  } : CreateMessageDTP) {
    const message = await Message.create({
      roomId,
      text,
      to
    })
    return message;
  }
}

export { CreateMessageService } 
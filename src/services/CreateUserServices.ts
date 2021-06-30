import { injectable } from "tsyringe";
import { User } from "../schemas/User"

interface CreateUserDTO {
  socket_id: string;
  avatar: string;
  name: string;
  email: string;
}

@injectable()
class CreateUserService {

  async execute({
    avatar,
    email,
    name,
    socket_id
  }: CreateUserDTO) {
    const userAlreadyExists = await User.findOne({
      email,
    }).exec();

    if(userAlreadyExists) {
      const user = await User.findOneAndUpdate({
        _id: userAlreadyExists._id,
      }, {
        $set: {
          socket_id, avatar, name
        }
      })
      return user;
    }
    const user = await User.create({
      email,
      name,
      avatar,
      socket_id,
    })
    return user;
  }
}

export { CreateUserService }
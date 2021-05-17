import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";
import { UsersService } from "../services/UsersService";

io.on("connect", (socket) => {
  const connetionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params;
    let varUserID = null;
    const userExist = await usersService.listByEmail(email);
    if (!userExist) {
      const user = await usersService.create(email);
      await connetionsService.create({
        socket_id,
        user_id: user.id,
      });

      varUserID = user.id;
    } else {
      varUserID = userExist.id;
      console.log(params);
      const connection = await connetionsService.findByUserID(userExist.id);

      if (!connection) {
        await connetionsService.create({
          socket_id,
          user_id: userExist.id,
        });
      } else {
        connection.socket_id = socket_id;
        await connetionsService.create(connection);
      }
    }
    await messagesService.create({
      text,
      user_id: varUserID,
    });
  });
});

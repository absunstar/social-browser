module.exports = function init(parent) {
  parent.WebSocket = require('ws');
  parent._chat_ = new parent.WebSocket.Server({
    noServer: true,
  });

  parent.api.servers.forEach((server) => {
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = parent.url.parse(request.url).pathname;

      if (pathname === '/x-chat') {
        parent._chat_.handleUpgrade(request, socket, head, function done(ws) {
          parent._chat_.emit('connection', ws, request);
        });
      }
    });
  });

  parent.chatUserList = [];
  parent.sendToAllChatUsers = function (message, parser, user) {
    parent.chatUserList.forEach((client) => {
      if (client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
        if (user && user.guid === client.guid) {
          return;
        }
        if (parser === false) {
          client.ws.send(message);
        } else {
          client.ws.send(JSON.stringify(message));
        }
      }
    });
  };

  parent._chat_.on('connection', (ws, req) => {
    let user = { guid: new Date().getTime() + '_' + Math.random(), isOnlie: true, joinTime: new Date().getTime(), ws: ws };

    ws.send(
      JSON.stringify({
        type: 'connected',
      }),
    );

    ws.on('message', (data) => {
      try {
        if (Buffer.isBuffer(data)) {
          console.log('isBuffer');
          parent.sendToAllChatUsers(new Uint8Array(data), false, user);
        } else {
          let message = JSON.parse(data);
          switch (message.type) {
            case '[request-join]':
              (user.userName = message.userName), parent.chatUserList.push(user);
              parent.sendToAllChatUsers({
                type: '[new-user-join]',
                user: {
                  guid: user.guid,
                  userName: user.userName,
                  isOnlie: user.isOnlie,
                  joinTime: user.joinTime,
                },
              });
              parent.sendToAllChatUsers(
                {
                  type: '[request-stream]',
                  guid: user.guid,
                },
                true,
                user,
              );
              break;
              case '[to-all]':
                parent.chatUserList.forEach((client) => {
                  if (client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                  }
                });
                break;
              case 'candidate':
              parent.chatUserList.forEach((client) => {
                if (client.guid == message.ref.guid && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
              case 'answer':
                parent.chatUserList.forEach((client) => {
                  if (client.guid == message.ref.guid && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                  }
                });
                break;
                case 'offer':
                  parent.chatUserList.forEach((client) => {
                    if (client.guid == message.ref.guid && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                      client.ws.send(JSON.stringify(message));
                    }
                  });
                  break;
            case '[to-other]':
              parent.chatUserList.forEach((client) => {
                if (client.index !== message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
            case '[to-index]':
              parent.chatUserList.forEach((client) => {
                if (client.index === message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                  client.ws.send(JSON.stringify(message));
                }
              });
              break;
            default:
              break;
          }
        }
      } catch (e) {
        console.log(e);
        ws.send(
          JSON.stringify({
            type: 'ERROR',
            payload: e,
          }),
        );
      }
    });
  });
};

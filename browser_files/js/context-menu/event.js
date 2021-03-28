exports = module.exports = function init(SOCIALBROWSER) {
  SOCIALBROWSER.events_list = [];
  SOCIALBROWSER.quee_list = [];
  SOCIALBROWSER.quee_busy_list = [];

  SOCIALBROWSER.quee_check = function (name, fire) {
    if (!fire) {
      if (SOCIALBROWSER.quee_busy_list[name]) {
        return;
      }
    }
    SOCIALBROWSER.quee_busy_list[name] = !0;
    let end = !1;
    SOCIALBROWSER.quee_list.forEach((quee, i) => {
      if (end) {
        return;
      }
      if (quee.name == name) {
        end = !0;
        SOCIALBROWSER.quee_list.splice(i, 1);
        for (var i = 0; i < SOCIALBROWSER.events_list.length; i++) {
          var ev = SOCIALBROWSER.events_list[i];
          if (ev.name == name) {
            ev.callback(quee.args, quee.callback2, () => {
              SOCIALBROWSER.quee_busy_list[name] = !1;
              SOCIALBROWSER.quee_check(name, !0);
            });
          }
        }
      }
    });
    if (!end) {
      SOCIALBROWSER.quee_busy_list[name] = !1;
    }
  };

  SOCIALBROWSER.onEvent = function (name, callback) {
    if (Array.isArray(name)) {
      name.forEach((n) => {
        SOCIALBROWSER.events_list.push({
          name: n,
          callback: callback || function () {},
        });
      });
    } else {
      SOCIALBROWSER.events_list.push({
        name: name,
        callback: callback || function () {},
      });
    }
  };

  SOCIALBROWSER.callEvent = function (name, args, callback2) {
    if (args && args.length === 1) {
      args = args[0];
    }
    for (var i = 0; i < SOCIALBROWSER.events_list.length; i++) {
      var ev = SOCIALBROWSER.events_list[i];
      if (ev.name == name) {
        ev.callback(args, callback2);
      }
    }
  };

  SOCIALBROWSER.quee = function (name, args, callback2) {
    if (args && args.length === 1) {
      args = args[0];
    }
    SOCIALBROWSER.quee_list.push({
      name: name,
      args: args,
      callback2: callback2,
    });

    SOCIALBROWSER.quee_check(name);
  };

};

module.exports = function (SOCIALBROWSER) {

    function escape(s) {
        if (!s) {
          return "";
        }
        if (typeof s !== "string") {
          s = s.toString();
        }
        return s.replace(/[\/\\^$*+?.()\[\]{}]/g, "\\$&");
      }
      
      if (!String.prototype.test) {
        Object.defineProperty(String.prototype, "test", {
          value: function (reg, flag = "gium") {
            try {
              return new RegExp(reg, flag).test(this);
            } catch (error) {
              return false;
            }
          },
        });
      }
      
      if (!String.prototype.like) {
        Object.defineProperty(String.prototype, "like", {
          value: function (name) {
            if (!name) {
              return false;
            }
            name = name.split("*");
            name.forEach((n, i) => {
              name[i] = escape(n);
            });
            name = name.join(".*");
            return this.test("^" + name + "$", "gium");
          },
        });
      }
      
      if (!String.prototype.contains) {
        Object.defineProperty(String.prototype, "contains", {
          value: function (name) {
            if (!name) {
              return false;
            }
            return this.test("^.*" + escape(name) + ".*$", "gium");
          },
        });
      }
}
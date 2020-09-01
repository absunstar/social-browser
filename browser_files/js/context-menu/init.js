module.exports = function (___) {

    console.clear = function () {

    }

    Object.defineProperty(String.prototype, 'test', {
        value: function (reg) {
            return new RegExp(reg, "gium").test(this);
        }
    });

    Object.defineProperty(String.prototype, 'like', {
        value: function (rule) {
            rule = rule.toString().replace('.', '\.')
            return this.test("^" + rule.split("*").join(".*") + "$")
        }
    });

    Object.defineProperty(String.prototype, 'contains', {
        value: function (name) {
            return this.like('*' + name + '*')
        }
    });
}
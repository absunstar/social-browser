module.exports = function (___) {
console.clear = function () {

}

String.prototype.test = function matchRuleShort(reg) {
    return new RegExp(reg).test(this);
}

String.prototype.like = function matchRuleShort(rule) {
    rule = rule.replace('.', '\.')
    return new RegExp("^" + rule.split("*").join(".*") + "$", "giu").test(this);
}

String.prototype.contains = function (name) {
    return this.like('*' + name + '*')
}
}




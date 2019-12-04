;(function(w, d, u) {
  window.memory = window.memory || []

  $f = NodeList.prototype
  $a = HTMLDivElement.prototype
  $a.isL = $f.isL = function() {
    return Object.prototype.toString.call(this) === "[object NodeList]"
  }

 const ___ = function(v) {
    if (typeof v !== "string") return []
    try {
      return d.querySelectorAll(v)
    } catch (e) {
      return []
    }
  }

  $a.assign = $f.assign = function(p, v) {
    if (typeof p === "string") p = p.split(".")

    if (p.length > 1) {
      var e = p.shift()
      this.assign(
        (this[e] = Object.prototype.toString.call(this[e]) === "[object Object]" ? this[e] : {}),
        p,
        v
      )
    } else {
      if (typeof v == u) {
        return !this.isL() ? this[p[0]] : typeof this[0] !== u ? this[0][p[0]] : ""
      } else {
        if (this.isL()) {
          for (var index = 0; index < this.length; index++) {
            var element = this[index]
            element[p[0]] = v
          }
        } else {
          this[p[0]] = v
        }
      }
      return this
    }
    return this
  }

  $a.html = $f.html = function(v) {
    return this.assign("innerHTML", v)
  }
  $a.text = $f.text = function(v) {
    return this.assign("innerText", v)
  }
  $a.val = $f.val = function(v) {
    return this.assign("value", v)
  }

  $a.append = $f.append = function(v) {
    return this.html(this.html() + v)
  }
  $a.prepend = $f.prepend = function(v) {
    return this.html(v + this.html())
  }

  $a.class = $f.class = function(v) {
    return this.assign("className", v)
  }

  $a.addClass = $f.addClass = function(v) {
    if (typeof v == u) return null

    if (!this.isL()) {
      this.className = this.className.replace(v, "")
      this.className += " " + v
    } else {
      for (var index = 0; index < this.length; index++) {
        var element = this[index]
        element.className = element.className.replace(v, "")
        element.className += " " + v
      }
    }

    return this
  }

  $a.removeClass = $f.removeClass = function(v) {
    if (typeof v == u) return null
    if (!this.isL()) {
      this.className = this.className.replace(v, "")
    } else {
      for (var index = 0; index < this.length; index++) {
        var element = this[index]
        element.className = element.className.replace(v, "")
      }
    }

    return this
  }

  $a.css = $f.css = function(k, v) {
    if (typeof k == u) return null
    if (typeof v == u) {
      if (!this.isL()) {
        return this.style[k] || null
      } else {
        return this[0].style[k] || null
      }
    } else {
      if (!this.isL()) {
        return (this.style[k] = v)
      } else {
        for (var index = 0; index < this.length; index++) {
          var element = this[index]
          element.style[k] = v
        }
      }
    }
    return this
  }

  $a.attr = $f.attr = function(k, v) {
    if (typeof k == u) return null
    if (typeof v == u) {
      if (this.isL()) {
        if (typeof this[0] !== u) {
          return this[0].getAttribute(k) || null
        }
      } else {
        return this.getAttribute(k) || null
      }
    } else {
      if (!this.isL()) {
        return this.setAttribute(k, v)
      } else {
        for (var index = 0; index < this.length; index++) {
          var element = this[index]
          element.setAttribute(k, v)
        }
      }
    }
    return null
  }

  $a.delete = $f.delete = function() {
    if (!this.isL()) {
      return this.parentNode.removeChild(this)
    } else {
      for (var index = 0; index < this.length; index++) {
        var element = this[index]
        element.parentNode.removeChild(element)
      }
    }

    return this
  }

  $a.hide = $f.hide = function() {
    return this.css("display", "none")
  }
  $a.show = $f.show = function() {
    return this.css("display", "")
  }
  let isHidden = false
  $a.toggle = $f.toggle = function() {
    if (isHidden) {
      isHidden = false
      return this.css("display", "")
    } else {
      isHidden = true
      return this.css("display", "none")
    }
  }

  $a.eq = $f.eq = function(n1) {
    return this[n1]
  }

  $a.on = $f.on = function(e, fn) {
    if (!this.isL()) {
      if (this.addEventListener) {
        this.addEventListener(e, fn)
      } else if (this.attachEvent) {
        this.attachEvent(e, fn)
      }
    } else {
      for (var index = 0; index < this.length; index++) {
        var element = this[index]
        if (element.addEventListener) {
          element.addEventListener(e, fn)
        } else if (element.attachEvent) {
          element.attachEvent(e, fn)
        }
      }
    }
  }

  ___.imagesDisplayed = true
  ___.toggleImages = () => {
    if (___.imagesDisplayed) {
      ___("img").css("visibility", "hidden")
      ___.imagesDisplayed = false
    } else {
      ___("img").css("visibility", "visible")
      ___.imagesDisplayed = true
    }
  }

  ___.removeAllIframes = ()=> {
    document.querySelectorAll("iframe").forEach(iframe => {
      iframe.remove()
    })
  }
  
  w.$html =  ___
})(window, document, "undefined")

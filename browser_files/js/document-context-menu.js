;
(function () {
  "use strict"

  return

  function onContextMenu(selector, callback) {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (el.addEventListener) {
        el.addEventListener(
          "contextmenu",
          function (e) {
            e.preventDefault()
            e.stopPropagation()
            callback(e)
          },
          false
        )
      } else {
        el.attachEvent("oncontextmenu", function () {
          var e = {
            target: el,
            x: mouseX(event),
            y: mouseY(event)
          }
          callback(e)
          window.event.returnValue = false
        })
      }
    })
  }

  function mouseX(evt) {
    if (evt.pageX) {
      return evt.pageX
    } else if (evt.clientX) {
      return (
        evt.clientX +
        (document.documentElement.scrollLeft ?
          document.documentElement.scrollLeft :
          document.body.scrollLeft)
      )
    } else {
      return null
    }
  }

  function mouseY(evt) {
    if (evt.pageY) {
      return evt.pageY
    } else if (evt.clientY) {
      return (
        evt.clientY +
        (document.documentElement.scrollTop ?
          document.documentElement.scrollTop :
          document.body.scrollTop)
      )
    } else {
      return null
    }
  }

  const contextId = "social-context-id"

  function sendMessage(cm) {
    window.open("http://browser.message/" + cm)
  }
  const menus = [{
    name: "Open Google Search",
    click: () => sendMessage("openGoogle")
  }]

  function li(ob) {
    let li = document.createElement("li")
    let img = document.createElement("img")
    let span = document.createElement("span")
    if (ob.class && ob.class == "line") {
      li.className = "line"
      return li
    }
    span.innerText = ob.name || ""
    li.onclick = ob.click || null
    li.className = ob.class || ""
    if (ob.src) {
      img.src = ob.src || null
    } else {
      img.style.visibility = "hidden"
    }
    li.appendChild(img)
    li.appendChild(span)

    return li
  }

  function hideContextMenu() {
    document.querySelectorAll(".social-context-menu").forEach(u => {
      u.parentNode.removeChild(u)
    })
  }

  function handleATag(el, ul) {
    if (!el) return
    if (el.tagName == "A" && el.getAttribute("href") && !el.getAttribute("href").startsWith("#")) {
      ul.appendChild(
        li({
          name: "Open Link in New Tab",
          click: () => window.open(el.getAttribute("href"), "open in new tab")
        })
      )
      ul.appendChild(
        li({
          name: "Copy Link Location",
          click: () => window.open(el.getAttribute("href"), "copy")
        })
      )

      return
    }

    handleATag(el.parentNode, ul)
  }

  function handleImgTag(el, ul) {
    if (!el) return
    if (el.tagName == "IMG" && el.getAttribute("src")) {
      ul.appendChild(
        li({
          name: "Open Image in New Tab",
          click: () => window.open(el.getAttribute("src"), "open in new tab")
        })
      )
    }
  }

  function handleDiv(el, ul) {
    if (!el) return
    if (el.tagName == "DIV") {
      let text = el.innerText
      if (text.length > 0) {
        ul.appendChild(
          li({
            name: "Copy Text",
            click: () => window.open("http://text.copy", text)
          })
        )
      }

      return
    }
    handleDiv(el.parentNode, ul)
  }

  function handleInput(el, ul) {
    let text = getSelection().toString()
    if (text.length > 0) {
      ul.appendChild(
        li({
          name: "Copy Selected Text",
          click: () => window.open("http://text.copy", text)
        })
      )
    }
    if (!el) return
    if (el.tagName == "INPUT") {
      let text = el.value
      if (text.length > 0) {
        ul.appendChild(
          li({
            name: "Copy Input Value",
            click: () => window.open("http://text.copy", text)
          })
        )
      }
      return
    }
  }

  function showContextMenu(e) {
    hideContextMenu()
    if (!e || !e.target) {
      return
    }

    if (e.target.tagName == "VIDEO") {
      return
    }
    if (e.target.tagName == "OBJECT") {
      return
    }
    var ul = document.createElement("ul")
    ul.id = contextId
    ul.className = "social-context-menu"
    

    handleInput(e.target, ul)
    handleATag(e.target, ul)
    handleImgTag(e.target, ul)
    ul.appendChild(li({
      class: "line"
    }))

    handleDiv(e.target, ul)
    menus.forEach((ob, i) => {
      ul.appendChild(li(ob))
    })

    ul.appendChild(li({
      class: "line"
    }))
    ul.appendChild(li({
      name: "Reload Page",
      click: () => sendMessage("reloadPage")
    }))
    ul.appendChild(li({
      class: "line"
    }))
    if (document.querySelectorAll("img").length > 0) {
      if (hideImageInterval) {
        ul.appendChild(li({
          name: "Show All Images",
          click: () => showImages()
        }))
      } else {
        ul.appendChild(li({
          name: "Hide All Images",
          click: () => hideImages()
        }))
      }
    }

    if (document.querySelectorAll("iframe").length > 0) {
      if (hideIframeInterval) {
        ul.appendChild(li({
          name: "Show All IFrames",
          click: () => showIframes()
        }))
      } else {
        ul.appendChild(li({
          name: "Hide All IFrames",
          click: () => hideIframes()
        }))
      }
    }

    ul.appendChild(li({
      class: "line"
    }))
    ul.appendChild(li({
      name: "Developer Tools",
      click: () => sendMessage("showDeveloperTools")
    }))

    ul.style.left = e.x + "px"
    ul.style.top = e.y + "px"

    document.querySelector("body").appendChild(ul)
  }

  document.addEventListener("contextmenu", function (e) {
    showContextMenu(e)
  })

  document.addEventListener("click", function (e) {
    hideContextMenu()
  })

  //   onContextMenu("input", e => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     showContextMenu(e)
  //   })
  //   onContextMenu("a", e => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     showContextMenu(e)
  //   })
  //   onContextMenu("img", e => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     showContextMenu(e)
  //   })

  let hideImageInterval = null

  function hideImages() {
    hideImageInterval = setInterval(function () {
      document.querySelectorAll("img").forEach(img => {
        img.style.visibility = "hidden"
      })
    }, 2000)
  }

  function showImages() {
    clearInterval(hideImageInterval)
    hideImageInterval = null
    document.querySelectorAll("img").forEach(img => {
      img.style.visibility = "visible"
    })
  }

  let hideIframeInterval = null

  function hideAllIframes() {
    document.querySelectorAll("iframe").forEach(iframe => {
      iframe.remove()
    })
  }
  
  window.hideIframes = function () {
    hideAllIframes()
    clearInterval(hideIframeInterval)
    hideIframeInterval = setInterval(function () {
      hideAllIframes()
    }, 5000)
  }

  function showIframes() {
    clearInterval(hideIframeInterval)
    hideIframeInterval = null
    document.querySelectorAll("iframe").forEach(iframe => {
      iframe.style.visibility = "visible"
    })
  }
  
})()
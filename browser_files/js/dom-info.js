;(function () {

  let res = {}

  res.logo =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]') ||
    document.querySelector('link[rel="image_src"]') ||
    document.querySelector('meta[property="og:image"]')

  if (res.logo) {
    res.logo = res.logo.getAttribute("href")
  } else {
    res.logo = "browser://images/no.png"
  }


  if (res.logo.indexOf("//") === 0) {
    res.logo = document.location.protocol + res.logo
  } else if (res.logo.indexOf("/") === 0) {
    res.logo = document.location.protocol + "//" + document.location.host + res.logo
  }else if (res.logo.indexOf("http") !== 0) {
    res.logo = document.location.protocol + "//" + document.location.host + '/' + res.logo
  } else {}

  res.title = document.querySelector("title").innerText

  return res
})()
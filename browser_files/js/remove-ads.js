(()=>{
    if(document.location.href.startsWith('https://www.youtube.com')){
        setInterval(()=>{
            document.querySelector('video').currentTime = document.querySelector('video').duration
        } , 1000)
    }
    
})

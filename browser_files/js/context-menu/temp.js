 // Video Recording
 const { desktopCapturer, remote } = SOCIALBROWSER.electron;

 const { writeFile } = SOCIALBROWSER.fs;

 const { dialog, Menu } = SOCIALBROWSER.remote;

 let mediaRecorder;
 let recordedChunks = [];

 async function record(options) {
   options = options || {
     play: false,
     stop: false,
     select: true,
   };

   if (options.start) {
     // SOCIALBROWSER.log('start')
     recordedChunks = [];
     mediaRecorder.start();
     setTimeout(() => {
       //  SOCIALBROWSER.log('stop')
       mediaRecorder.stop();
     }, 1000 * 10);
   }
   if (options.stop) {
     mediaRecorder.stop();
   }
   if (options.select) {
     getVideoSources();
   }

   // Get the available video sources
   async function getVideoSources() {
     const inputSources = await desktopCapturer.getSources({
       types: ['window', 'screen'],
     });

     const videoOptionsMenu = Menu.buildFromTemplate(
       inputSources.map((source) => {
         return {
           label: source.name,
           click: () => selectSource(source),
         };
       }),
     );

     videoOptionsMenu.popup();
   }

   // Change the videoSource window to record
   async function selectSource(source) {
     let videoElement = document.querySelector('#__video_element');
     videoElement.style.display = 'block';

     // SOCIALBROWSER.log(videoElement)
     const constraints = {
       audio: false,
       video: {
         mandatory: {
           chromeMediaSource: 'desktop',
           chromeMediaSourceId: source.id,
         },
       },
     };

     // Create a Stream
     const stream = await navigator.mediaDevices.getUserMedia(constraints);

     // SOCIALBROWSER.log(stream);
     // Preview the source in a video element
     videoElement.srcObject = stream;
     videoElement.play();

     // Create the Media Recorder
     const options = {
       mimeType: 'video/webm; codecs=vp9',
     };
     mediaRecorder = new MediaRecorder(stream, options);

     // Register Event Handlers
     mediaRecorder.ondataavailable = handleDataAvailable;
     mediaRecorder.onstop = handleStop;

     // Updates the UI
   }

   // Captures all recorded chunks
   function handleDataAvailable(e) {
     // SOCIALBROWSER.log('video data available');
     recordedChunks.push(e.data);
   }

   // Saves the video file on stop
   async function handleStop(e) {
     let videoElement = document.querySelector('#__video_element');
     videoElement.style.display = 'none';
     const blob = new Blob(recordedChunks, {
       type: 'video/webm; codecs=vp9',
     });

     const buffer = Buffer.from(await blob.arrayBuffer());

     const { filePath } = await dialog.showSaveDialog({
       buttonLabel: 'Save video',
       defaultPath: `vid-${Date.now()}.webm`,
     });

     if (filePath) {
       writeFile(filePath, buffer, () => SOCIALBROWSER.log('video saved successfully!'));
     }
   }
 }
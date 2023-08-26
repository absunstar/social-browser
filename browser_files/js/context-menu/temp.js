 
  Date.prototype.getTimezoneOffset = function () {
    return SOCIALBROWSER.session.privacy.vpc.timeZone.offset * 60;
  };
  Date.prototype.toString0 = Date.prototype.toString;
  Date.prototype.toString = function () {
    return this.toString0()
      .replace(/GMT*/, 'GMT' + SOCIALBROWSER.session.privacy.vpc.timeZone.offset)
      .replace(/\((.*)\)/, ` ( ${SOCIALBROWSER.session.privacy.vpc.timeZone.offset} )`);
  };

  window.Intl.DateTimeFormat.prototype.resolvedOptions = function () {
    return {
      calendar: 'gregory',
      day: 'numeric',
      locale: navigator.language,
      month: 'numeric',
      numberingSystem: 'latn',
      timeZone: SOCIALBROWSER.session.privacy.vpc.timeZone.text,
      year: 'numeric',
    };
  };
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

 SOCIALBROWSER.allowTrustedEvents = function () {
  if (SOCIALBROWSER.allowTrustedEventsSets) {
      return;
  }
  SOCIALBROWSER.allowTrustedEventsSets = true;

  SOCIALBROWSER.handleEventListener = function (eventTarget) {
      eventTarget.handler2 = function (...params) {
          if (eventTarget.type.like('click') && params.length > 0) {
              let default_event = params[0];

              eventTarget.event2 = eventTarget.event2 || {
                  get isTrusted() {
                      return true;
                  },
                  get view() {
                      return default_event.view;
                  },
                  get target() {
                      return default_event.target;
                  },
                  get cancelable() {
                      return default_event.cancelable;
                  },
                  get bubbles() {
                      return default_event.bubbles;
                  },
                  get defaultPrevented() {
                      return default_event.defaultPrevented;
                  },
                  get timeStamp() {
                      return default_event.timeStamp;
                  },
                  get composed() {
                      return default_event.composed;
                  },
                  get currentTarget() {
                      return default_event.currentTarget;
                  },
                  get eventPhase() {
                      return default_event.eventPhase;
                  },

                  get srcElement() {
                      return default_event.srcElement;
                  },
                  get relatedTarget() {
                      return default_event.relatedTarget;
                  },
                  get region() {
                      return default_event.region;
                  },
                  get path() {
                      return default_event.path;
                  },
                  get type() {
                      return default_event.type;
                  },
                  get which() {
                      return default_event.which;
                  },
                  get shiftKey() {
                      return default_event.shiftKey;
                  },
                  get metaKey() {
                      return default_event.metaKey;
                  },
                  get ctrlKey() {
                      return default_event.ctrlKey;
                  },
                  get altKey() {
                      return default_event.altKey;
                  },
                  get screenY() {
                      return default_event.screenY || 300;
                  },
                  get screenX() {
                      return default_event.screenX || 450;
                  },

                  get pageY() {
                      return default_event.pageY || 300;
                  },
                  get pageX() {
                      return default_event.pageX || 450;
                  },
                  get clientY() {
                      return default_event.clientY || 300;
                  },
                  get clientX() {
                      return default_event.clientX || 450;
                  },
                  get offsetY() {
                      return default_event.offsetY;
                  },
                  get offsetX() {
                      return default_event.offsetX;
                  },
                  get movementY() {
                      return default_event.movementY;
                  },
                  get movementX() {
                      return default_event.movementX;
                  },
                  get buttons() {
                      return default_event.buttons;
                  },
                  get button() {
                      return default_event.button;
                  },
                  get originalEvent() {
                      return default_event;
                  },
                  initEvent() {
                      return default_event.initEvent();
                  },
                  preventDefault() {
                      return default_event.preventDefault();
                  },
                  stopImmediatePropagation() {
                      return default_event.stopImmediatePropagation();
                  },
                  stopPropagation() {
                      this.stopPropagationSet = true;
                      return default_event.stopPropagation();
                  },
                  composedPath() {
                      return default_event.composedPath();
                  },
              };
              params[0] = eventTarget.event2;
              eventTarget.handler(...params);
          } else {
              eventTarget.handler(...params);
          }
      };
  };

  if (EventTarget.prototype.addEventListener) {
    SOCIALBROWSER.eventOff += 'document(mouseleave)|document(mouseout)|document(pagehide)|document(hashchange)|document(popstate)|document(state-change)|document(visibilitychange)|document(webkitvisibilitychange)|document(blur)';
    SOCIALBROWSER.eventOff += 'window(mouseleave)|window(mouseout)|window(pagehide)|window(hashchange)|window(popstate)|window(state-change)|window(visibilitychange)|window(webkitvisibilitychange)|window(blur)';

      EventTarget.prototype.removeEventListener0 = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.removeEventListener = function (type, handler, option) {
          let exists = false;
          if (typeof type == 'string' && handler && typeof handler === 'function') {
              SOCIALBROWSER.events.forEach((ev) => {
                  if (ev.this === this && ev.handler === handler) {
                      exists = true;
                      return this.removeEventListener0(ev.type, ev.handler2, ev.option);
                  }
              });
          }
          if (!exists) {
              return this.removeEventListener0(type, handler, option);
          }
      };
      EventTarget.prototype.addEventListener0 = EventTarget.prototype.addEventListener;
      EventTarget.prototype.removeEvent = function (type) {
          delete this.listeners[type];
      };
      EventTarget.prototype.addEventListener = function (type, handler, option) {
          let eventTarget = {
              this: this,
              selector: '',
              enabled: true,
              type: type,
              handler: handler,
              handler2: handler,
              option: option,
          };
          let selector = '';

          if (this instanceof Document) {
              eventTarget.selector += 'document';
          } else if (this instanceof Window) {
              eventTarget.selector += 'window';
          } else if (this instanceof Element) {
              eventTarget.selector += this.tagName;
          }

          if (typeof type == 'string') {
              eventTarget.selector += `${this.id ? '#' + this.id : ''}${this.className ? '.' + this.className : ''}(${type})`;
              if (typeof type == 'string' && eventTarget.selector.like(SOCIALBROWSER.eventOff) && !eventTarget.selector.like(SOCIALBROWSER.eventOn)) {
                  SOCIALBROWSER.log(`${selector} ::OFF:: `);
                  eventTarget.enabled = false;
                  SOCIALBROWSER.events.push(eventTarget);
                  return;
              } else {
                  if (typeof type == 'string' && eventTarget.handler && typeof eventTarget.handler === 'function') {
                      SOCIALBROWSER.handleEventListener(eventTarget);
                  }
              }
              SOCIALBROWSER.events.push(eventTarget);
          }

          return this.addEventListener0(eventTarget.type, eventTarget.handler2, eventTarget.option);
      };
  }
};


 // Event = function () {
    //     return {
    //         isTrusted: true,
    //     };
    // };
    // PointerEvent.prototype.constructor = {
    //     get() {
    //         return {
    //             isTrusted : true
    //         };
    //     },
    //     set() {},
    // };
    // PointerEvent.prototype.isTrusted = {
    //     get() {
    //         return true;
    //     },
    //     set() {},
    // };

    // SOCIALBROWSER.__define(Event, 'isTrusted', {
    //     get() {
    //         return true;
    //     },
    //     set() {},
    // });

    // EventTarget

  

    // window.setInterval0 = window.setInterval;
    // window.setInterval = function (...args) {
    //   return window.setInterval0(...args);
    // };
    // window.setTimeout0 = window.setTimeout;
    // window.setTimeout = function (...args) {
    //   return window.setTimeout0(...args);
    // };

            // SOCIALBROWSER.call('[send-render-message]', {
        //   name: 'get_pdf',
        //   options: options || {},
        //   win_id: SOCIALBROWSER.currentWindow.id,
        // });

        // return;
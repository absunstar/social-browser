if (document.location.href.like('*://challenges.cloudflare.com/*')) {
  SOCIALBROWSER.onLoad(() => {
    async function ShadowFinder() {
      const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
      const delay = async (milliseconds) => await new Promise((resolve) => setTimeout(resolve, milliseconds));
      const randomInteger = (n, r) => {
        return Math.floor(Math.random() * (r - n + 1)) + n;
      };
      const simulateMouseClick = (element, box, clientX = null, clientY = null) => {
        box = element.getBoundingClientRect();
        clientX = randomInteger(box.left, box.left + box.width);
        clientY = randomInteger(box.top, box.top + box.height);

        // SOCIALBROWSER.click(box);

        eventNames.forEach((eventName) => {
          const event = new MouseEvent(eventName, {
            detail: eventName === 'mouseover' ? 0 : 1,
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: clientX,
            clientY: clientY,
          });
          element.dispatchEvent(event);
        });
      };

      async function Click(shadowRoot) {
        while (true) {
          await delay(100);

          if (shadowRoot.querySelector('div[style*="display: grid"] > div > label')) {
            const element = shadowRoot.querySelector('div[style*="display: grid"] > div > label');

            await delay(randomInteger(500, 1000));

            // Click the Element
            simulateMouseClick(element);

            // Check if Element is detected as clicked
            if (element.querySelector('input') && element.querySelector('input').getAttribute('aria-checked') !== null) {
              return;
            }
          }
        }
      }

      const originalAttachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function (init) {
        let shadowRoot = originalAttachShadow.call(this, init);
        window.parent !== window && shadowRoot ? Click(shadowRoot) : undefined;
        return shadowRoot;
      };
    }

    const attachShadowReplacement = '(' + ShadowFinder.toString().replace('ShadowFinder', '') + ')();';
    const attachShadowReplacementScript = document.createElement('script');
    attachShadowReplacementScript.textContent = attachShadowReplacement;
    document.documentElement.appendChild(attachShadowReplacementScript);
  });
}

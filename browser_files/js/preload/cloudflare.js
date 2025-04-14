module.exports = function (SOCIALBROWSER) {
    if (document.location.href.like('*://challenges.cloudflare.com/*')) {
        SOCIALBROWSER.sendMessage('[cloudflare-detected]');

        SOCIALBROWSER.onLoad(() => {
            async function ShadowFinder() {
                const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                const delay = async (milliseconds) => await new Promise((resolve) => setTimeout(resolve, milliseconds));
                const randomInteger = (n, r) => {
                    return Math.floor(Math.random() * (r - n + 1)) + n;
                };
                const simulateMouseClick = (element, box, clientX = null, clientY = null) => {
                    return SOCIALBROWSER.click(element);
                    box = element.getBoundingClientRect();

                    clientX = randomInteger(box.left, box.left + box.width);
                    clientY = randomInteger(box.top, box.top + box.height);

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

                async function Click2(shadowRoot) {
                    if (shadowRoot.querySelector('div[style*="display: grid"] > div > label')) {
                        const element = shadowRoot.querySelector('div[style*="display: grid"] > div input');

                        if (element && element.getAttribute('aria-checked') !== null) {
                        } else {
                            simulateMouseClick(element);
                        }
                    }
                    await delay(randomInteger(500, 2000));
                    Click2(shadowRoot);
                }

                const originalAttachShadow = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function (init) {
                    let shadowRoot = originalAttachShadow.call(this, init);
                    window.parent !== window && shadowRoot ? Click2(shadowRoot) : undefined;
                    return shadowRoot;
                };
            }

            const attachShadowReplacement = '(' + ShadowFinder.toString().replace('ShadowFinder', '') + ')();';
            SOCIALBROWSER.eval(attachShadowReplacement);
        });
    }
};

const tabList = [];

const tabsvg =
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="topleft" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="topright" viewBox="0 0 214 29"><use xlink:href="#topleft"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="80%" height="100%" transfrom="scale(-1, 1)"><use xlink:href="#topleft" width="214" height="29" class="social-tab-background"/><use xlink:href="#topleft" width="214" height="29" class="social-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#topright" width="214" height="29" class="social-tab-background"/><use xlink:href="#topright" width="214" height="29" class="social-tab-shadow"/></svg></g></svg>';
const tabTemplate = `
    <div class="social-tab">
      <div class="social-tab-background">
        ${tabsvg}
      </div>
      <div class="social-tab-loading"></div>
      <div class="social-tab-favicon"></div>
      <div class="social-tab-title"><p ></p></div>
      <div class="social-tab-close" title="Close Tab">
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><path stroke='#5a5a5a' stroke-linecap='round' stroke-width='1.125' d='M4 4 L10 10 M10 4 L4 10'></path></svg>
      </div>
    </div>
  `;

const plusTemplate2 = `
  <div class="social-tab plus "  id="tabPlus" title="New Tab">
    <div class="social-tab-background">
    
    <svg width="40" height="20" xmlns="http://www.w3.org/2000/svg">
    <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
   
    <g>
     <title>background</title>
     <rect x="-1" y="-1" width="42" height="22" id="canvas_background" fill="#282828"/>
     <g id="canvasGrid" display="none">
      <rect id="svg_2" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"/>
     </g>
    </g>
    <g>
     <title>Layer 1</title>
     <rect fill="#eaf7f7" stroke="#000" stroke-width="1.5" x="210.55213" y="135.30951" width="62.88077" height="27.18947" id="svg_1" transform="rotate(0.174662, 241.993, 148.904)"/>
    </g>
   </svg>


    </div>
    <div class="social-tab-title"> <i class="fa fa-plus"></i> </div>
  </div>
`;
const plusTemplate = `
  <div class="social-tab plus center"  id="tabPlus" title="New Tab">
    <i class="fa fa-plus"></i>
  </div>
`;
let defaultTapProperties = {
  id: '',
  url: 'http://127.0.0.1:60080/newTab',
  title: null,
  iconURL: 'browser://images/loading-white.gif',
};

function getDefaultTapProperties() {
  if (SOCIALBROWSER.var.core.default_page) {
    defaultTapProperties.url = SOCIALBROWSER.var.core.default_page;
    if (SOCIALBROWSER.var.core.default_page == 'http://127.0.0.1:60080/newTab') {
      defaultTapProperties.iconURL = 'browser://images/logo.png';
    }
  }

  if (SOCIALBROWSER.var.core.defaultUserAgent) {
    defaultTapProperties.userAgentURL = SOCIALBROWSER.var.core.defaultUserAgent.url;
  }

  return { ...defaultTapProperties };
}

client.on('setting changed', (arr) => {
  let setting = arr[0];
  if (setting && setting.core) {
    if (setting.core.default_page) {
      defaultTapProperties.url = setting.core.default_page;
    }

    if (setting.core.defaultUserAgent) {
      defaultTapProperties.userAgentURL = setting.core.defaultUserAgent.url;
    }
  }
});

let instanceId = 0;

class SocialTabs {
  constructor() {
    this.draggabillyInstances = [];
  }

  init(el, options) {
    this.el = el;
    this.options = options;

    this.instanceId = instanceId;
    this.el.setAttribute('data-social-tabs-instance-id', this.instanceId);
    instanceId += 1;

    this.setupStyleEl();
    this.setupEvents();
    this.layoutTabs();
    this.fixZIndexes();
    this.setupDraggabilly();

    this.tabContentEl.appendChild(this.createNewTabPlus());
    $('#tabPlus').click(() => {
      event.preventDefault();
      event.stopPropagation();
      this.addTab({});
    });

    client.on('remove-tab', (node) => {
      this.removeTab(node);
    });
    client.on('remove-tabs', (nodes) => {
      nodes.forEach((node) => {
        this.removeTab(node);
      });
    });
  }

  emit(eventName, data) {
    this.el.dispatchEvent(
      new CustomEvent(eventName, {
        detail: data,
      })
    );
  }

  setupStyleEl() {
    this.animationStyleEl = document.createElement('style');
    this.el.appendChild(this.animationStyleEl);
  }

  setupEvents() {
    window.addEventListener('resize', (event) => this.layoutTabs());

    //  this.el.addEventListener('dblclick', event => this.addTab())

    this.el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.target.classList.contains('social-tab') && !e.target.classList.contains('plus')) {
        this.setCurrentTab(e.target);
      } else if (e.target.classList.contains('social-tab-close')) {
        this.removeTab(e.target.parentNode);
      } else if (e.target.classList.contains('social-tab-title') || e.target.classList.contains('social-tab-favicon')) {
        this.setCurrentTab(e.target.parentNode);
      }
    });
  }

  get tabEls() {
    return Array.prototype.slice.call(this.el.querySelectorAll('.social-tab:not(.display-none)'));
  }

  get tabContentEl() {
    return this.el.querySelector('.social-tabs-content');
  }

  get tabWidth() {
    const tabsContentWidth = this.tabContentEl.clientWidth - this.options.tabOverlapDistance;
    const width = tabsContentWidth / this.tabEls.length + this.options.tabOverlapDistance;
    return Math.max(this.options.minWidth, Math.min(this.options.maxWidth, width));
  }

  get tabEffectiveWidth() {
    return this.tabWidth - this.options.tabOverlapDistance;
  }

  get tabPositions() {
    const tabEffectiveWidth = this.tabEffectiveWidth;
    let left = 0;
    let positions = [];

    this.tabEls.forEach((tabEl, i) => {
      positions.push(left);
      left += tabEffectiveWidth;
    });
    return positions;
  }

  layoutTabs() {
    $('.social-tab.plus').remove();
    this.tabContentEl.appendChild(this.createNewTabPlus());

    $('#tabPlus').click(() => {
      event.preventDefault();
      event.stopPropagation();
      this.addTab({});
    });

    const tabWidth = this.tabWidth;
    this.cleanUpPreviouslyDraggedTabs();

    this.tabEls.forEach((tabEl) => {
      if (tabEl.id == 'tabPlus') {
        tabEl.style.width = '20px';
      } else {
        tabEl.style.width = tabWidth + 'px';
      }
    });

    requestAnimationFrame(() => {
      this.tabPositions.forEach((left, i) => {
        this.tabEls[i].style.transform = `translate3d(${left}px, 0, 0)`;
      });
    });
  }

  fixZIndexes() {
    const bottomBarEl = this.el.querySelector('.social-tabs-bottom-bar');
    const tabEls = this.tabEls;

    tabEls.forEach((tabEl, i) => {
      let zIndex = tabEls.length - i;

      if (tabEl.classList.contains('social-tab-current')) {
        bottomBarEl.style.zIndex = tabEls.length + 1;
        zIndex = tabEls.length + 2;
        currentTabId = tabEl.id;
      }
      tabEl.style.zIndex = zIndex;
    });
  }

  createNewTabEl() {
    const div = document.createElement('div');
    div.innerHTML = tabTemplate;
    return div.firstElementChild;
  }

  createNewTabPlus() {
    const div = document.createElement('div');
    div.innerHTML = plusTemplate;
    return div.firstElementChild;
  }

  addTab(tabProperties) {
    // console.log(tabProperties)

    if (!tabProperties.partition || !tabProperties.user_name) {
      SOCIALBROWSER.ipc('[open new tab]', {
        ...tabProperties,
        windowType: 'view',
        url: tabProperties.url || defaultTapProperties.url,
        source: 'session',
        mainWindowID: SOCIALBROWSER.remote.getCurrentWindow().id,
      });
      return;
    }

    if (!tabProperties.url.like('http://127.0.0.1:60080*')) {
      if ($('.social-tab').length > SOCIALBROWSER.var.core.max_tabs) {
        showMessage(`Sorry You Used Max Opened Tabs ( ${SOCIALBROWSER.var.core.max_tabs} ) <small> Change from setting </small>`);
        return;
      }
    }

    if (tabProperties.url.like('http://127.0.0.1:60080*')) {
      let exists = false;
      document.querySelectorAll('.social-tab').forEach((tb) => {
        if (tb.getAttribute('url') == tabProperties.url) {
          exists = true;
          this.setCurrentTab(tb);
        }
      });

      if (exists) {
        return;
      }
    }

    const tabEl = this.createNewTabEl();

    tabEl.classList.add('social-tab-just-added');
    setTimeout(() => tabEl.classList.remove('social-tab-just-added'), 500);

    tabProperties = {
      ...getDefaultTapProperties(),
      id: 'tab_' + new Date().getTime(),
      ...tabProperties,
    };

    this.tabContentEl.appendChild(tabEl);

    $('#tabPlus').click(() => {
      event.preventDefault();
      event.stopPropagation();
      this.addTab({});
    });

    this.updateTab(tabEl, tabProperties);
    this.emit('tabAdd', {
      tabEl,
      tabProperties,
    });

    if ($('.social-tab:not(.display-none)').length == 2) {
      this.setCurrentTab(tabEl, tabProperties);
    } else if (tabProperties.url.like('http://127.0.0.1:60080*')) {
      this.setCurrentTab(tabEl, tabProperties);
    } else if (tabProperties.active) {
      this.setCurrentTab(tabEl, tabProperties);
    }

    this.layoutTabs();
    this.fixZIndexes();
    this.setupDraggabilly();

    tabEl.addEventListener('mousedown', (e) => {
      // console.log('tab mousedown' , e)
      if (e.which == 2) {
        e.preventDefault();
        this.removeTab(tabEl);
      }
    });
  }

  setCurrentTab(tabEl) {
    const currentTab = this.el.querySelector('.social-tab-current');
    if (currentTab) {
      currentTab.classList.remove('social-tab-current');
    }

    if (tabEl && tabEl.classList.contains('display-none')) {
      tabEl = null;
    }
    tabEl = tabEl || document.querySelector('.social-tab:not(.display-none):not(.plus)');

    if (tabEl) {
      tabEl.classList.add('social-tab-current');
      this.fixZIndexes();
      this.emit('activeTabChange', {
        tabEl,
      });
    }
  }

  removeTab(tabEl) {
    if (!tabEl) return;

    let isCurrentTab = false;

    if (tabEl.classList.contains('social-tab-current')) {
      isCurrentTab = true;
    }

    if (isCurrentTab) {
      if (tabEl.previousElementSibling) {
        this.setCurrentTab(tabEl.previousElementSibling);
      } else if (tabEl.nextElementSibling) {
        this.setCurrentTab(tabEl.nextElementSibling);
      } else {
        this.setCurrentTab();
      }
    }

    let id = tabEl.id;
    tabEl.parentNode.removeChild(tabEl);

    this.emit('tabRemove', {
      id,
    });

    this.layoutTabs();
    this.fixZIndexes();
    this.setupDraggabilly();
  }

  updateTab(tabEl, tabProperties) {
    tabEl.setAttribute('id', tabProperties.id);
    tabEl.setAttribute('url', tabProperties.url);
    tabEl.setAttribute('userAgentURL', tabProperties.userAgentURL);
    tabEl.setAttribute('partition', tabProperties.partition);
    tabEl.setAttribute('user_name', tabProperties.user_name);
    tabEl.setAttribute('proxy', tabProperties.proxy);
    tabEl.setAttribute('webaudio', tabProperties.webaudio);
    tabEl.querySelector('.social-tab-title p').innerText = tabProperties.title || tabProperties.url;
    tabEl.querySelector('.social-tab-favicon').style.backgroundImage = `url('${tabProperties.iconURL}')`;
  }

  cleanUpPreviouslyDraggedTabs() {
    this.tabEls.forEach((tabEl) => tabEl.classList.remove('social-tab-just-dragged'));
  }

  setupDraggabilly() {
    const tabEls = this.tabEls;
    const tabEffectiveWidth = this.tabEffectiveWidth;
    const tabPositions = this.tabPositions;

    this.draggabillyInstances.forEach((draggabillyInstance) => draggabillyInstance.destroy());

    tabEls.forEach((tabEl, originalIndex) => {
      const originalTabPositionX = tabPositions[originalIndex];
      const draggabillyInstance = new Draggabilly(tabEl, {
        axis: 'x',
        containment: this.tabContentEl,
      });

      this.draggabillyInstances.push(draggabillyInstance);

      draggabillyInstance.on('dragStart', () => {
        this.cleanUpPreviouslyDraggedTabs();
        tabEl.classList.add('social-tab-currently-dragged');
        this.el.classList.add('social-tabs-sorting');
        this.fixZIndexes();
      });

      draggabillyInstance.on('dragEnd', () => {
        const finalTranslateX = parseFloat(tabEl.style.left, 10);
        tabEl.style.transform = `translate3d(0, 0, 0)`;

        // Animate dragged tab back into its place
        requestAnimationFrame(() => {
          tabEl.style.left = '0';
          tabEl.style.transform = `translate3d(${finalTranslateX}px, 0, 0)`;

          requestAnimationFrame(() => {
            tabEl.classList.remove('social-tab-currently-dragged');
            this.el.classList.remove('social-tabs-sorting');

            this.setCurrentTab(tabEl);
            tabEl.classList.add('social-tab-just-dragged');

            requestAnimationFrame(() => {
              tabEl.style.transform = '';
              this.layoutTabs();
              this.setupDraggabilly();
            });
          });
        });
      });

      draggabillyInstance.on('dragMove', (event, pointer, moveVector) => {
        // Current index be computed within the event since it can change during the dragMove
        const tabEls = this.tabEls;
        const currentIndex = tabEls.indexOf(tabEl);

        const currentTabPositionX = originalTabPositionX + moveVector.x;
        const destinationIndex = Math.max(0, Math.min(tabEls.length, Math.floor((currentTabPositionX + tabEffectiveWidth / 2) / tabEffectiveWidth)));

        if (currentIndex !== destinationIndex) {
          this.animateTabMove(tabEl, currentIndex, destinationIndex);
        }
      });
    });
  }

  animateTabMove(tabEl, originIndex, destinationIndex) {
    if (destinationIndex < originIndex) {
      tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex]);
    } else {
      tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
    }
  }
}

window.SocialTabs = SocialTabs;

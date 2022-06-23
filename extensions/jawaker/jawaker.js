SOCIALBROWSER.jawaker = {
  gameType: null,
  firstCard: null,
  firstCardType: null,
  canPlay: false,
  autoPlayInterval: null,
  log: function (msg) {
    document.querySelector('#_msg_').innerHTML = msg;
  },
  newWindow: function (partition) {
    SOCIALBROWSER.ipc('[send-render-message]', {
      name: '[open new popup]',
      alwaysOnTop: false,
      partition: partition || SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.referrer,
    });
  },
};
SOCIALBROWSER.jawaker.autoPlay = function () {
  let playbtn = document.querySelector('#play_btn');
  let stopbtn = document.querySelector('#stop_btn');
  if (playbtn && stopbtn) {
    playbtn.classList.add('hide2');
    stopbtn.classList.remove('hide2');
  } else {
    return;
  }

  SOCIALBROWSER.jawaker.canPlay = true;
  localStorage.setItem('autoPlay', 'ok');
  SOCIALBROWSER.jawaker.Play();
  SOCIALBROWSER.jawaker.autoPlayInterval = setInterval(() => {
    SOCIALBROWSER.jawaker.Play();
  }, 1000 * 5);
};
SOCIALBROWSER.jawaker.stopPlay = function () {
  let playbtn = document.querySelector('#play_btn');
  let stopbtn = document.querySelector('#stop_btn');
  if (playbtn && stopbtn) {
    playbtn.classList.remove('hide2');
    stopbtn.classList.add('hide2');
  } else {
    return;
  }

  SOCIALBROWSER.jawaker.canPlay = false;
  localStorage.setItem('autoPlay', 'no');
  clearInterval(SOCIALBROWSER.jawaker.autoPlayInterval);
};

SOCIALBROWSER.jawaker.Play = function () {
  if (!SOCIALBROWSER.jawaker.canPlay) {
    SOCIALBROWSER.jawaker.log('stop Playing');
    return;
  }

  SOCIALBROWSER.jawaker.log('check actions ...');

  if (document.querySelector('a.play-now')) {
    SOCIALBROWSER.click('a.play-now');
    SOCIALBROWSER.jawaker.log('Play Now Clicked');
    SOCIALBROWSER.jawaker.busy = false;
    return;
  }
  if (document.querySelector('.player-actions a')) {
    SOCIALBROWSER.click('.player-actions a');
    SOCIALBROWSER.jawaker.log('Ready Clicked');
    SOCIALBROWSER.jawaker.busy = false;
    return;
  }
  if (document.querySelector('#game-summary a')) {
    SOCIALBROWSER.click('#game-summary a');
    SOCIALBROWSER.jawaker.log('Play Again');
    SOCIALBROWSER.jawaker.busy = false;
    return;
  }

  if (document.querySelector('.modal-wrapper button')) {
    SOCIALBROWSER.click('.modal-wrapper button');
    SOCIALBROWSER.jawaker.log('Back to game Clicked');
    SOCIALBROWSER.jawaker.busy = false;
    return;
  }
};
SOCIALBROWSER.jawaker.PlayCard = function () {
  if (!SOCIALBROWSER.jawaker.canPlay) {
    SOCIALBROWSER.jawaker.log('stop Playing');
    return;
  }
  if (SOCIALBROWSER.jawaker.busy) {
    SOCIALBROWSER.jawaker.log('Thinking ...');
    return;
  }
  SOCIALBROWSER.jawaker.busy = true;
  SOCIALBROWSER.jawaker.log('Try Playing ');

  SOCIALBROWSER.jawaker.played = false;
  SOCIALBROWSER.jawaker.firstCardType = null;
  SOCIALBROWSER.jawaker.firstCard = null;

  SOCIALBROWSER.jawaker.firstCard = document.querySelector('#table-stack .card');

  if (SOCIALBROWSER.jawaker.firstCard) {
    if (SOCIALBROWSER.jawaker.firstCard.className.contains('heart')) {
      SOCIALBROWSER.jawaker.firstCardType = 'heart';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('diamond')) {
      SOCIALBROWSER.jawaker.firstCardType = 'diamond';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('spade')) {
      SOCIALBROWSER.jawaker.firstCardType = 'spade';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('club')) {
      SOCIALBROWSER.jawaker.firstCardType = 'club';
    }
  }

  let cards_heart = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="heart"]');
  let cards_diamond = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="diamond"]');
  let cards_spade = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="spade"]');
  let cards_club = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card[class*="club"]');
  let cards = [];

  cards_spade.forEach((card) => {
    cards.unshift(card);
  });
  cards_club.forEach((card) => {
    cards.unshift(card);
  });
  cards_heart.forEach((card) => {
    cards.unshift(card);
  });
  cards_diamond.forEach((card) => {
    cards.unshift(card);
  });
  cards.forEach((card, i) => {
    if (card.className.like('*-k-*|*-Q*')) {
      cards.unshift(card);
    }
  });
  cards.forEach((card, i) => {
    if (SOCIALBROWSER.jawaker.firstCardType && card.className.contains(SOCIALBROWSER.jawaker.firstCardType)) {
      SOCIALBROWSER.jawaker.played = true;
      SOCIALBROWSER.jawaker.log('try Play like first card');
      setTimeout(() => {
        if (SOCIALBROWSER.jawaker.isMyTurn) {
          SOCIALBROWSER.click(card);
          SOCIALBROWSER.jawaker.log('click like first card');
        }
      }, 100 * i);
    }
    if (!SOCIALBROWSER.jawaker.played) {
      SOCIALBROWSER.jawaker.log('try Play like any card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          if (SOCIALBROWSER.jawaker.isMyTurn) {
            SOCIALBROWSER.click(card);
            SOCIALBROWSER.jawaker.log('click any card');
          }
        }, 100 * i);
      });
    }
  });

  setTimeout(() => {
    SOCIALBROWSER.jawaker.busy = false;
    SOCIALBROWSER.jawaker.log('.....................');
  }, 1000 * 2);
};

SOCIALBROWSER.jawaker.handlePanel = function () {
  let panel = document.querySelector('.panel1');
  let panel2 = document.querySelector('.panel2');
  if (document.location.href.like('*games*|*competitions*|*challenges*') && panel) {
    if (document.location.href.like('*tarneeb*|*estimation*|*handgame*|*complex*|*banakil*|*saudi*|*basra*|*leekha*|*sbeetiya*|*kout*|*nathala*|*hareega*|*kasra*|*jack*')) {
      panel.classList.add('hide2');
      panel2.classList.add('hide2');
      SOCIALBROWSER.jawaker.stopPlay();
    } else {
      if (SOCIALBROWSER.__options.windowType.contains('popup')) {
        panel.classList.remove('hide2');
        document.querySelector('#__sb_url').value = document.location.href;
        if (localStorage.getItem('autoPlay') === 'ok') {
          SOCIALBROWSER.jawaker.autoPlay();
        }
      } else {
        panel2.classList.remove('hide2');
        SOCIALBROWSER.var.session_list.forEach((s) => {
          panel2.innerHTML += `<a class="btn2" onclick="SOCIALBROWSER.jawaker.newWindow('${s.name}')"> Open Hack as ( ${s.display} ) </a><br><br>`;
        });
      }
    }
  }
};
window.addEventListener('locationchange', function () {
  SOCIALBROWSER.jawaker.handlePanel();
});
if (SOCIALBROWSER.__options.windowType.contains('popup')) {
  setInterval(() => {
    let seat = document.querySelector('.seat.current');
    if (seat && seat.className.contains('active')) {
      SOCIALBROWSER.jawaker.isMyTurn = true;
      SOCIALBROWSER.jawaker.log('My Turn ^_^', 200);
      SOCIALBROWSER.jawaker.PlayCard();
    } else {
      SOCIALBROWSER.jawaker.isMyTurn = false;
      SOCIALBROWSER.jawaker.log('.....................');
    }
  }, 200);
  setTimeout(() => {
    document.location.reload();
  }, 1000 * 60 * 15);
}

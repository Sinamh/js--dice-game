'use strict';

const newgamebtn = document.querySelector('.btn--new');
const rolldicebtn = document.querySelector('.btn--roll');
const holdbtn = document.querySelector('.btn--hold');
const diceimg = document.querySelector('.dice');
const player1Panel = document.querySelector('.player--0');
const player2Panel = document.querySelector('.player--1');
const player1TotalScore = document.querySelector('#score--0');
const player2TotalScore = document.querySelector('#score--1');
const player1CurrentScore = document.querySelector('#current--0');
const player2CurrentScore = document.querySelector('#current--1');
let states = {
  p1Turn: true,
  halt: true,
  rolltime: 0,
  p1cs: 0,
  p2cs: 0,
  p1ts: 0,
  p2ts: 0,
};

const setUpgame = function () {
  states.p1Turn = true;
  states.halt = true;
  states.rolltime = 0;
  player1TotalScore.textContent = 0;
  player2TotalScore.textContent = 0;
  player1CurrentScore.textContent = 0;
  player2CurrentScore.textContent = 0;
  states.gameactive = true;
  states.p1ts = 0;
  states.p2ts = 0;

  if (player1Panel.classList.contains('player--winner')) {
    player1Panel.classList.remove('player--winner');
  }

  if (player2Panel.classList.contains('player--winner')) {
    player2Panel.classList.remove('player--winner');
  }

  if (
    player1Panel.classList.contains('player--active') ||
    player2Panel.classList.contains('player--active')
  ) {
    player1Panel.classList.remove('player--active');
    player2Panel.classList.remove('player--active');
  }

  if (diceimg) {
    diceimg.style.display = 'none';
  }
};
setUpgame();

newgamebtn.addEventListener('click', setUpgame);

rolldicebtn.addEventListener('click', function () {
  if (states.gameactive) {
    if (states.rolltime === 0) {
      player1Panel.classList.add('player--active');
      if (player2Panel.classList.contains('player--active')) {
        player2Panel.classList.remove('player--active');
      }
      if (states.halt && states.p1Turn) {
        states.player1s = Math.trunc(Math.random() * 6 + 1);
        diceimg.style.display = 'block';
        diceimg.src = `dice-${states.player1s}.png`;
        states.p1Turn = false;
      }
      states.rolltime++;
    } else if (states.rolltime === 1) {
      if (player1Panel.classList.contains('player--active')) {
        player1Panel.classList.remove('player--active');
      }
      player2Panel.classList.add('player--active');
      if (states.halt && !states.p1Turn) {
        states.player2s = Math.trunc(Math.random() * 6 + 1);
        diceimg.style.display = 'block';
        diceimg.src = `dice-${states.player2s}.png`;
        states.halt = false;
      }
      states.p1Turn = states.player1s >= states.player2s ? true : false;
      states.rolltime++;
    } else {
      if (states.p1Turn) {
        states.p1rand = Math.trunc(Math.random() * 6 + 1);
        player1Panel.classList.add('player--active');
        if (player2Panel.classList.contains('player--active')) {
          player2Panel.classList.remove('player--active');
        }
        states.p1cs += states.p1rand;
        diceimg.src = `dice-${states.p1rand}.png`;
        if (states.p1rand === 1) {
          states.p1Turn = false;
          states.p1cs = 0;
          if (player1Panel.classList.contains('player--active')) {
            player1Panel.classList.remove('player--active');
          }
          player2Panel.classList.add('player--active');
        }
        player1CurrentScore.textContent = states.p1cs;
      } else {
        states.p2rand = Math.trunc(Math.random() * 6 + 1);
        if (player1Panel.classList.contains('player--active')) {
          player1Panel.classList.remove('player--active');
        }
        player2Panel.classList.add('player--active');
        states.p2cs += states.p2rand;
        diceimg.src = `dice-${states.p2rand}.png`;
        if (states.p2rand === 1) {
          states.p1Turn = true;
          states.p2cs = 0;
          player1Panel.classList.add('player--active');
          if (player2Panel.classList.contains('player--active')) {
            player2Panel.classList.remove('player--active');
          }
        }
        player2CurrentScore.textContent = states.p2cs;
      }
      states.activatehold = true;
    }
  }
});

holdbtn.addEventListener('click', function () {
  if (states.gameactive) {
    if (states.activatehold) {
      if (states.p1Turn) {
        // console.log('hold runs if');
        states.p1ts += states.p1cs;
        states.p1cs = 0;
        player1CurrentScore.textContent = states.p1cs;
        player1TotalScore.textContent = states.p1ts;
        states.p1Turn = false;
        if (player1Panel.classList.contains('player--active')) {
          player1Panel.classList.remove('player--active');
        }
        player2Panel.classList.add('player--active');
      } else {
        // console.log('hold runs else');
        states.p2ts += states.p2cs;
        states.p2cs = 0;
        player2CurrentScore.textContent = states.p2cs;
        player2TotalScore.textContent = states.p2ts;
        states.p1Turn = true;
        player1Panel.classList.add('player--active');
        if (player2Panel.classList.contains('player--active')) {
          player2Panel.classList.remove('player--active');
        }
      }
      states.activatehold = false;
    }

    if (states.p1ts >= 100) {
      player1TotalScore.textContent = 'Wins!';
      player1Panel.classList.add('player--winner');
      diceimg.style.display = 'none';
      states.gameactive = false;
    }

    if (states.p2ts >= 100) {
      player2TotalScore.textContent = 'Wins!';
      player2Panel.classList.add('player--winner');
      diceimg.style.display = 'none';
      states.gameactive = false;
    }
  }
});

import createKeyboardListener from './keyboard.js';
import createGame from './game.js';
import renderScreen, { setupScreen } from './render.js';

const screen = document.getElementById("screen");
const scoreTable = document.getElementById('score-table');
const game = createGame();

const socket = io();
let keyboardListenerAdded = false;

socket.on('connect', () => {
    const playerId = socket.id;
    console.log(`Player connected on client with id: ${playerId}`);
});

socket.on('startUp', state => {
    const playerId = socket.id;

    if (!keyboardListenerAdded) {
        createKeyboardListener(document, keyPressed => {
            game.movePlayer(playerId, keyPressed);
            socket.emit('move-player', keyPressed);
        });
        keyboardListenerAdded = true;
    }

    console.log('Start Game State:');
    console.log(game.state);

    setupScreen(screen, game);
    renderScreen(screen, scoreTable, game, requestAnimationFrame, playerId);
});

socket.on('update', state => {
    console.log(state);
    game.setState(state);
});
import createKeyboardListener from './keyboard.js';
import createGame from './game.js';
import renderScreen from './render.js';

const screen = document.getElementById("screen");
const game = createGame();

const socket = io();
let keyboardListenerAdded = false;

socket.on('connect', () => {
    const playerId = socket.id;
    console.log(`Player connected on client with id: ${playerId}`);

    if (!keyboardListenerAdded) {
        createKeyboardListener(document, keyPressed => {
            game.movePlayer(playerId, keyPressed);
            socket.emit('move-player', keyPressed);
        });
        keyboardListenerAdded = true;
    }

    console.log('Game state');
    console.log(game.state);
    renderScreen(screen, game, requestAnimationFrame, playerId);
});

socket.on('update', state => {
    console.log(state);
    game.setState(state);
});
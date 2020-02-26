import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import createGame from './server-game.js';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();
game.start()

game.subscribe(state => {
    console.log(`> Update`);
    sockets.emit('update', state);
});

sockets.on('connection', socket => {
    const playerId = socket.id;
    console.log(`> Player connected: ${playerId}`);

    game.addPlayer({ playerId });

    socket.on('disconnect', () => {
        game.removePlayer({ playerId });
        console.log(`> Player disconnected: ${playerId}`);
    })

    socket.on('move-player', keyPressed => {

        // Evita de mover outro jogador
        const command = {
            playerId,
            keyPressed
        }

        game.movePlayer(command);
    });
});

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`);
});
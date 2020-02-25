export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
   
    const context = screen.getContext('2d');

    // Limpa a Tela
    context.clearRect(0, 0, 10, 10);

    // Desenha os jogadores
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        
        if (playerId == currentPlayerId){
            context.fillStyle = '#F0DB4F';
        } else {
            context.fillStyle = 'black';
        }

        context.fillRect(player.x, player.y, 1, 1);
    }

    // Desenha as frutas
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }

    requestAnimationFrame(() => renderScreen(screen, game, requestAnimationFrame, currentPlayerId));
}

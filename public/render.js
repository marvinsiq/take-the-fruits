export function setupScreen(canvas, game) {
    const { screen: {width, height} } = game.state;

    console.log(`Configurando tela com ${width} x ${height} `);

    canvas.width = width;
    canvas.height = height;
}

export default function renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId) {
   
    const context = screen.getContext('2d');

    // Limpa a Tela
    const { screen: {width, height} } = game.state;
    context.clearRect(0, 0, width, height);

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

    updateScoreTable(scoreTable, game, currentPlayerId);
    requestAnimationFrame(() => renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId));
}

function updateScoreTable(scoreTable, game, currentPlayerId) {
    const maxResults = 10

    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Top 10 Jogadores</td>
            <td>Pontos</td>
        </tr>
    `

    const playersArray = []

    for (let socketId in game.state.players) {
        const player = game.state.players[socketId]
        playersArray.push({
            playerId: socketId,
            x: player.x,
            y: player.y,
            score: player.score,
        })
    }
    
    const playersSortedByScore = playersArray.sort( (first, second) => {
        if (first.score < second.score) {
            return 1
        }

        if (first.score > second.score) {
            return -1
        }

        return 0
    })

    const topScorePlayers = playersSortedByScore.slice(0, maxResults)

    scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => {
        return stringFormed + `
            <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
                <td>${player.playerId}</td>
                <td>${player.score}</td>
            </tr>
        `
    }, scoreTableInnerHTML)

    const currentPlayerFromTopScore = topScorePlayers[currentPlayerId]

    if (currentPlayerFromTopScore) {
        scoreTableInnerHTML += `
            <tr class="current-player bottom">
                <td class="socket-id">${currentPlayerFromTopScore.id} EU </td>
                <td class="score-value">${currentPlayerFromTopScore.score}</td>
            </tr>
        `
    }

    scoreTable.innerHTML = scoreTableInnerHTML
}

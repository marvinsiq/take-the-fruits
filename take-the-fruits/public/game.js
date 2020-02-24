export default function createGame() {

    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    function addPlayer(command) {

        const id = command.playerId;
        const x = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const y = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[id] = {
            id,
            x,
            y
        }
    }

    function removePlayer(command) {
        const playerId = command.playerId;
        delete state.players[playerId];
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

    }

    function checkForFruitCollision(player) {

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checking ${player.id} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLLISION between ${player.id} and ${fruitId}`)
                removeFruit({ fruitId: fruitId })
            }
        }
    }


    function movePlayer(command) {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

        const acceptedMoves = {
            ArrowUp(player) {
                player.y = Math.max(player.y - 1, 0);
            },
            ArrowRight(player) {
                player.x = Math.min(player.x + 1, state.screen.width - 1);
            },
            ArrowDown(player) {
                player.y = Math.min(player.y + 1, state.screen.height - 1);
            },
            ArrowLeft(player) {
                player.x = Math.max(player.x - 1, 0);
            }
        }

        const player = state.players[command.playerId];
        const moveFunction = acceptedMoves[command.keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(player);
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state
    }

}
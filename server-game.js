export default function createGame() {

    let observer;

    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 25,
            height: 25
        }
    };

    function start() {
        const frequency = 3000;
        setInterval(needAddFruit, frequency);
    }

    function needAddFruit() {
        if (Object.keys(state.fruits).length < 3) {
            addFruit();
        }
    }

    function subscribe(observerFunction) {
        observer = observerFunction;
    }

    function notify(state) {
        observer(state);
    }

    function addPlayer(command) {

        const id = command.playerId;
        const x = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const y = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[id] = {
            id,
            score: 0,
            x,
            y
        }

        notify(state);
    }

    function removePlayer(command) {
        const playerId = command.playerId;
        delete state.players[playerId];

        notify(state);
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };

        notify(state);

    }

    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]

        notify(state);
    }

    function checkForFruitCollision(player) {

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            //console.log(`Checking ${player.id} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                player.score++;
                console.log(`COLLISION between ${player.id} and ${fruitId}`)
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    function movePlayer(command) {
        
        //console.log(`>> Moving ${command.playerId} with ${command.keyPressed}`);

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

        notify(state);
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    return {
        start,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        
        state,
        setState,
        subscribe
    }

}

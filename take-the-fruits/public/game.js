export default function createGame() {

    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    };
    
    function movePlayer(playerId, keyPressed) {
        
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

        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    return {
        movePlayer,
        setState,
        state
    }

}

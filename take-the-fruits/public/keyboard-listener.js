export default function createKeyboardListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }    

    function subscribe(observerFunction) {
        //console.log(`Subscribing ${observerFunction}`);
        state.observers.push(observerFunction);
    }

    function notityAll(command) {
        //console.log(`Notifying ${state.observers.length} observers.`);
        state.observers.forEach(observerFunction => {
            observerFunction(command);
        });
    }

    document.addEventListener("keydown", event => {
        const keyPressed = event.key;

        const command = {
            type: "move-layer",
            playerId: state.playerId,
            keyPressed
        }

        notityAll(command);
    });

    return {
        subscribe,
        registerPlayerId
    }
}
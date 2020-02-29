export default function createKeyboardListener(document, callback) {

    document.addEventListener("keydown", event => {
        callback(event.key);
    });
}
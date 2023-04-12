const socket = io('https://getdata.johntheguy.tk');
import handle from "./main.js";
socket.on('chat', message => {
    handle.chat(message.user, message.message);
});

socket.on('move', (move) => {
    handle.move(move);
});

socket.on('color', color => {
    handle.setColor(color);
});

socket.on('spectatorBoard', (board, color) => {
    handle.setSpecBoard(board, color);
});

export default class actions {
    static chat(user, message) {
        socket.emit('chat', user, message);
    }
    static move(move, board) {
        socket.emit('move', move, board);
    }
}
const url = window.location.href;
const parts = url.split('/');
const gameId = parts[parts.length - 1];

socket.emit('conn', gameId)
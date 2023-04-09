const socket = io('https://getdata.johntheguy.tk');
import handle from "./main.js";
socket.on('chat', message => {
    handle.chat(message.user, message.message);
    // console.log(user)
    console.log(message)
});

socket.on('move', board => {
    handle.move(board);
});

socket.on('color', color => {
    handle.setColor(color);
});


export default class actions {
    static chat(user, message) {
        socket.emit('chat', user, message);
    }
    static move(board) {
        socket.emit('move', board);
    }
}
const url = window.location.href;
const parts = url.split('/');
const gameId = parts[parts.length - 1];

socket.emit('conn', gameId)


console.log(gameId)
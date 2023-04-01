const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
    // cors: {
    //     origin: "https://test8test.johntheguy.tk",
    //     methods: ["POST"]
    // }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('move', (board) =>     {
        io.emit('move', board);   
    });
    socket.on('chat', (user, message) =>     {
        io.emit('chat', {user: user, message: message});   
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );
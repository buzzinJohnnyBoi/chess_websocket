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

    socket.on('move', (selectedPiece) =>     {
        console.log(selectedPiece);
        io.emit('move', selectedPiece);   
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );
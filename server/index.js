const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
    // cors: {
    //     origin: "https://test8test.johntheguy.tk",
    //     methods: ["POST"]
    // }
});

var users = {
    1234: {white: null, black: null, spectators: []}
};
// io.of('/1234').on('connection', function(socket) {
io.on('connection', function(socket) {
    if(users[1234].white == null) {
        users[1234].white = socket.id;
        console.log("white user connected")
        io.to(socket.id).emit('color', 'white');
    }
    else {
        users[1234].black = socket.id;
        console.log("nigtet user connected");
        io.to(socket.id).emit('color', 'black');
    }
    // else if(users[1234].black == null) {
    // else {
    //     users[1234].spectators.push(socket.id);
    // }
    // console.log('New client connected with ID:', socket.id);
    socket.on('move', (board) =>     {
        // io.of('/' + 1234).emit('move', board);   
        socket.broadcast.emit('move', board);   
    });
    socket.on('chat', (user, message) =>     {
        // io.of('/' + 1234).emit('chat', {user: user, message: message});   
        io.emit('chat', {user: user, message: message});   
    });
});


http.listen(8080, () => console.log('listening on http://localhost:8080') );
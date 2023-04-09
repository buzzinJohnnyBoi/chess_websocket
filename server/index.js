const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
    // cors: {
    //     origin: "https://test8test.johntheguy.tk",
    //     methods: ["POST"]
    // }
});

var users = {
    // 1234: {white: null, black: null, spectators: []}
};
// io.of('/1234').on('connection', function(socket) {
    io.on('connection', function(socket) {
        // console.log('New client connected with ID:', socket.id);
        socket.on('move', (board) =>     {
            const oppoId = findOppoId(findGameId(socket.id), socket.id);
        io.to(oppoId).emit('move', board);
    });
    socket.on('chat', (user, message) =>     {
        const oppoId = findOppoId(findGameId(socket.id), socket.id);
        io.to(oppoId).emit('chat', {user: user, message: message});   
    });
    socket.on('conn', (id) =>     {
        console.log(id);
        if(users[id] == null) {
            newGame(id);
            users[id].white = socket.id;
            console.log("white user connected")
            io.to(socket.id).emit('color', 'white');
        }
        else {
            users[id].black = socket.id;
            console.log("black user connected")
            io.to(socket.id).emit('color', 'black');
        }
    });
    
    // if(users[1234].white == null) {
        //     users[1234].white = socket.id;
        //     console.log("white user connected")
        //     io.to(socket.id).emit('color', 'white');
        // }
        // // else if(users[1234].black == null) {
            //     // else {
    // //     users[1234].spectators.push(socket.id);
    // // }
    // else {
    //     users[1234].black = socket.id;
    //     console.log("nigtet user connected");
    //     io.to(socket.id).emit('color', 'black');
    // }
});

function newGame(id) {
    users[id] = {white: null, black: null, spectators: []};
}
function findGameId(id) {
    for (var game in users) { 
        console.log(users[game]);
        if(users[game].white == id || users[game].black == id) {
            return game;
        }
    }
}
function findOppoId(game, id) {
    if(users[game].white == id) {
        return users[game].black;
    }
    else if (users[game].black == id) {
        return users[game].white;
    }
}

// console.log(findGameId(1234))
http.listen(8080, () => console.log('listening on http://localhost:8080') );
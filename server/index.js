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
    socket.on('getVals', () => {
        const vals = getVals();
        io.to(socket.id).emit('getVals', vals);
    });
    socket.on('move', (move, board) =>     {
        const game = findGameId(socket.id);
        const oppoId = findOppoId(game, socket.id);
        io.to(oppoId).emit('move', move);
        users[game].board = board;
        users[game].lastMove = move;
    });
    socket.on('chat', (user, message) =>     {
        const oppoId = findOppoId(findGameId(socket.id), socket.id);
        io.to(oppoId).emit('chat', {user: user, message: message});   
    });

    socket.on('createGame', (id) => {
        if(id != "") {
            io.to(socket.id).emit('createGame', {taken: checkId(id), id: id});
        }
        else {
            io.to(socket.id).emit('createGame', {taken: false, id: findNewId()});
        }
    });
    socket.on('conn', (id) =>     {
        if(users[id] == null) {
            newGame(id);
            users[id].white = socket.id;
            io.to(socket.id).emit('color', 'white');
            console.log("john")

        }
        else {
            users[id].black = socket.id;
            io.to(socket.id).emit('color', 'black');
            const game = findGameId(socket.id);
            const oppoId = findOppoId(game, socket.id);
            io.to(oppoId).emit('chat', {user: "server", message: "black user connected"});   
            
            if(users[game].lastMove != null) {
                io.to(socket.id).emit('move', users[game].lastMove);
            }
            // if(users[game].black == socket.id) {
            // }
            // else if(users[game].white == socket.id) {
            //     io.to(oppoId).emit('chat', {user: "server", message: "white user connected"});   
            // }
        }
    });
    socket.on('disconnect', function() {
        console.log('Client disconnected with ID:', socket.id);
        const game = findGameId(socket.id);
        if(game != null) {
            const oppoId = findOppoId(game, socket.id);
            if(users[game].black == socket.id) {
                io.to(oppoId).emit('chat', {user: "server", message: "black user disconnected"});   
            }
            else if(users[game].white == socket.id) {
                io.to(oppoId).emit('chat', {user: "server", message: "white user disconnected"});   
            }
        }
    });
});

function newGame(id) {
    users[id] = {white: null, black: null, board: null, lastMove: null, spectators: []};
}
function findGameId(id) {
    for (var game in users) { 
        if(users[game].white == id || users[game].black == id) {
            return game;
        }
    }
    return null;
}
function findOppoId(game, id) {
    if(users[game].white == id) {
        return users[game].black;
    }
    else if (users[game].black == id) {
        return users[game].white;
    }
}

function findNewId() {
    var i = 0;
    while(users[i] != null) {
        i++;
    }
    return i;
}

function checkId(id) {
    if(users[id] == null) {
        return false;
    }
    return false;
}

function getVals() {
    var currentGames = [];
    if(users.length == 0) {
        currentGames = null;
    }
    else {
        for (var id in users) {
            currentGames.push({
                open: (users[id].white != null && users[id].black != null) ? false : true,
                link: id,
            });
        }
    }
    return {
        currentGames: currentGames
    }
}

http.listen(8080, () => console.log('listening on http://localhost:8080') );
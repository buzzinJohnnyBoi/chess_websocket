const http = require('http').createServer();
const fs = require('fs');

const io = require('socket.io')(http, {
    cors: { origin: "*" }
    // cors: {
    //     origin: "https://test8test.johntheguy.tk",
    //     methods: ["POST"]
    // }
});


class UpdateData {
    updateNumGames() {
        fs.readFile('data.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const jsonData = JSON.parse(data);
          const newNumGames = jsonData.numgames + 1;
          jsonData.numgames = newNumGames;
          fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
    }
    readNumGames(callback) {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const jsonData = JSON.parse(data);
            callback(jsonData.numgames);
        });
    }
}

const updateData = new UpdateData();
var numGamesEver = 0;
updateData.readNumGames((numGamesEver) => {
    numGamesEver = 0;
});

var users = {

};
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
        if(users[game].spectators.length > 0) {
            for (let i = 0; i < users[game].spectators.length; i++) {
                const user = users[game].spectators[i];
                io.to(user).emit('spectatorBoard', board, (users[game].white == socket.id) ? "white" : "black");
            }
        }
    });
    socket.on('chat', (user, message) =>     {
        const game = findGameId(socket.id);
        if(game != null) {
            const oppoId = findOppoId(game, socket.id);
            io.to(oppoId).emit('chat', {user: user, message: message});   
        }
    });

    socket.on('createGame', (id, color, type) => {
        if(id != "") {
            const gameIdTaken = checkId(id);
            if(!gameIdTaken) {
                if(newGame(id, color, type)) {
                    io.to(socket.id).emit('createGame', {taken: false, id: id});
                    updateData.updateNumGames();
                    numGamesEver++;
                }
            }
            else {
                io.to(socket.id).emit('createGame', {taken: true, id: id});
            }
        }
        else {
            const gameId = findNewId();
            if(newGame(gameId, color, type)) {
                io.to(socket.id).emit('createGame', {taken: false, id: gameId});
                updateData.updateNumGames();
                numGamesEver++;
            }
        }
        console.log(users[id]);
    });
    socket.on('conn', (id) =>     {
        if(users[id] != null) {
            if(users[id].white == null && users[id].black == null) {
                if(users[id].firstJoin == "white") {
                    users[id].white = socket.id;
                    io.to(socket.id).emit('color', 'white');
                }
                else {
                    users[id].black = socket.id;
                    io.to(socket.id).emit('color', 'black');
                }
                const vals = getVals();
                io.emit('getVals', vals);
            }
            else if (users[id].white == null || users[id].black == null) {
                // say something about the chat
                if(users[id].white == null) {
                    users[id].white = socket.id;
                    io.to(socket.id).emit('color', 'white');
                }
                else {
                    users[id].black = socket.id;
                    io.to(socket.id).emit('color', 'black');
                }
                const game = findGameId(socket.id);

                const oppoId = findOppoId(game, socket.id);
                io.to(oppoId).emit('chat', {user: "server", message: "Your opponent has connected"});   

                if(users[game].lastMove != null) {
                    io.to(socket.id).emit('move', users[game].lastMove);
                }
                const vals = getVals();
                io.emit('getVals', vals);
            }
            else {
                users[id].spectators.push(socket.id);
                if(users[id].board != null) {
                    io.to(socket.id).emit('spectatorBoard', users[id].board, (users[id].lastMove.id > 0) ? "white" : "black");
                }
                io.to(users[id].white).emit('chat', { user: "server", message: "Spectator #" + users[id].spectators.length +" is watching"});
                io.to(users[id].black).emit('chat', { user: "server", message: "Spectator #" + users[id].spectators.length +" is watching"});
            }
        }
    });
    socket.on('disconnect', function() {
        console.log('Client disconnected with ID:', socket.id);
        const game = findGameId(socket.id);
        if(game != null) {
            const oppoId = findOppoId(game, socket.id);
            if(users[game].black == socket.id) {
                io.to(oppoId).emit('chat', {user: "server", message: "black user disconnected"});   
                users[game].black = null;
            }
            else if(users[game].white == socket.id) {
                io.to(oppoId).emit('chat', {user: "server", message: "white user disconnected"});   
                users[game].white = null;
            }
            if(users[game].white == null && users[game].black == null) {
                delete users[game];
                const vals = getVals();
                io.emit('getVals', vals);
            }
        }
        else {
            deleteSpec(socket.id);
        }
    });
});

function newGame(id, firstJoin, type) {
    if(users[id] == null) {
        users[id] = {type: type, firstJoin: firstJoin, white: null, black: null, board: null, lastMove: null, spectators: []};
        return true;
    }
    return false;
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

function deleteSpec(id) {
    for (var game in users) { 
        for (let i = 0; i < users[game].spectators.length; i++) {
            const user = users[game].spectators[i];
            if(id == user) {
                users[game].spectators.splice(i, 1);
                return ;
            }
        }
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
    if (users[id] == null && users[String(parseInt(id))] == null) {
      return false;
    }
    return true;
}

function getVals() {
    var currentGames = [];
    if(users.length == 0) {
        currentGames = null;
    }
    else {
        for (var id in users) {
            if(users[id].type == "public") {
                currentGames.push({
                    open: (users[id].white != null && users[id].black != null) ? false : true,
                    link: id,
                });
            }
        }
    }
    return {
        currentGames: currentGames,
        totalGames: numGamesEver
    }
}


http.listen(8080, () => console.log('listening on http://localhost:8080') );
const socket = io('https://getdata.johntheguy.tk');
socket.on('move', move => {
    console.log(move)
    // board1.board[move.col][move.row] = move.id;
    board1.moveP(move.row, move.col, move.id, move.newrow, move.newcol)
    console.log(board1)
});

function move(selectedPiece) {
    socket.emit('move', selectedPiece);
}
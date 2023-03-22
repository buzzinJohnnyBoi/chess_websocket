export class chess {
    constructor(board, players = [0, 1]) {
        this.board = board;
        this.players = players;
    }
    update() {
        this.board.update();
        console.log(this.board)
    }
}
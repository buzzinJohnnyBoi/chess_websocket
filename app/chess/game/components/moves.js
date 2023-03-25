import {pieces} from "./pieces.js";

export class moves {
    static pawn(dir, row, col, board, lastMove) {
        const b = {
            rows: board[0].length,
            cols: board.length,
        }
        const pawnvals = this.pawnData(dir, b.rows, b.cols);
        var moves = [];
        if(board[col - dir][row] == 0) {
            moves.push({row: row, col: col - dir});
            if(col == pawnvals.startCol && board[col - dir * 2][row] == 0) {
                moves.push({row: row, col: col - dir * 2});
            }
        }
        let s = board[col - dir][row - 1];
        if(s != 0 && this.oppoSide(dir, s)) {
            moves.push({row: row - 1, col: col - dir});
        }
        s = board[col - dir][row + 1];
        if(s != 0 && this.oppoSide(dir, s)) {
            moves.push({row: row + 1, col: col - dir});
        }
        s = board[col][row - 1];

        let oppoPawnVals = this.pawnData(dir * -1, b.rows, b.cols);
        // console.log(-s == dir);
        // console.log(col == oppoPawnVals.enPassentCol);
        // console.log(prevboard[col][row - 1] == 0);
        // console.log(prevboard);
        // if(-s == dir && col == oppoPawnVals.enPassentCol && prevboard[col][row - 1] == 0 && prevboard[col + dir][row - 1] == 0) {
        //     moves.push({row: row - 1, col: col - dir});
        // }
        if(lastMove != null) {
            // console.log(lastMove.id == -dir)
            // console.log(lastMove.orgCol + dir * 2)
            // console.log(Math.abs(col - lastMove.col))
            if(lastMove.id == -dir && lastMove.orgCol + dir * 2 == lastMove.col && col == oppoPawnVals.enPassentCol && Math.abs(row - lastMove.row) == 1) {
                moves.push({row: lastMove.row, col: lastMove.orgCol + dir, extra: {type: "take", row: lastMove.row, col: lastMove.col}})
            }
        }

        return moves;
    }
    static knight(id, row, col, board) {
        const offsetsKnight = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        var moves = [];
        for (var i = 0; i < offsetsKnight.length; i++) {
            const x = row + offsetsKnight[i][0];
            const y = col + offsetsKnight[i][1];
            if(this.onBoard(x, y, board) && (this.oppoSide(board[y][x], id) || board[y][x] == 0)) {
                moves.push({row: x, col: y})
            }
        }
        return moves;
    }
    static bishop(id, row, col, board) {
        const offsetsBishop = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
        var moves = []
        for(var i = 0; i < offsetsBishop.length; i++) {
            let offBoard = false;
            let r = row + offsetsBishop[i][0];
            let c = col + offsetsBishop[i][1];
            while(!offBoard) {
                if(this.onBoard(r, c, board)) {
                    if(board[c][r] == 0) {
                        moves.push({row: r, col: c});
                    }
                    else if(this.oppoSide(id, board[c][r])) {
                        moves.push({row: r, col: c});
                        offBoard = true;
                    }
                    else {
                        offBoard = true;
                    }
                }
                else {
                    offBoard = true;
                }
                r += offsetsBishop[i][0];
                c += offsetsBishop[i][1];
            }
        }
        return moves;
    }
    static rook(id, row, col, board) {
        const offsetsRook = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        var moves = []
        for(var i = 0; i < offsetsRook.length; i++) {
            let offBoard = false;
            let r = row + offsetsRook[i][0];
            let c = col + offsetsRook[i][1];
            while(!offBoard) {
                if(this.onBoard(r, c, board)) {
                    if(board[c][r] == 0) {
                        moves.push({row: r, col: c});
                    }
                    else if(this.oppoSide(id, board[c][r])) {
                        moves.push({row: r, col: c});
                        offBoard = true;
                    }
                    else {
                        offBoard = true;
                    }
                }
                else {
                    offBoard = true;
                }
                r += offsetsRook[i][0];
                c += offsetsRook[i][1];
            }
        }
        return moves;
    }
    static queen(id, row, col, board) {
        const rookMoves = this.rook(id, row, col, board);
        const bishopMoves = this.bishop(id, row, col, board);
        return rookMoves.concat(bishopMoves);
    }
    static king(id, row, col, board) {
        const offsetsKing = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
        var moves = [];
        for (var i = 0; i < offsetsKing.length; i++) {
            const x = row + offsetsKing[i][0];
            const y = col + offsetsKing[i][1];
            if(this.onBoard(x, y, board) && (this.oppoSide(board[y][x], id) || board[y][x] == 0)) {
                moves.push({row: x, col: y})
            }
        }
        return moves;
    }
    //---
    static pawnData(id, rows, cols) {
        if(id > 0) {
            return {
                startCol: cols - 2,
                queenCol: 0,
                enPassentCol: cols - 4,
            }
        }
        else {
            return {
                startCol: 1,
                queenCol: cols - 1,
                enPassentCol: 3,
            } 
        }
    }
    static oppoSide(id1, id2) {
        if((id1 > 0 && id2 < 0) || (id1 < 0 && id2 > 0)) {
            return true;
        }
    }
    static onBoard(row, col, board) {
        if(board.length - 1 < col || col < 0) {
            return false;
        }
        if(board[0].length - 1 < row || row < 0) {
            return false;
        }
        return true;
    }
    static legalMoves(moves, board, id, row, col) {
        var legalmoves = [];
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const oldSqaure = board[move.col][move.row];
            board[move.col][move.row] = id;
            board[col][row] = 0;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    const sqaure = board[i][j];
                    if(sqaure != 0 && this.oppoSide(sqaure, id)) {

                        for (let i = 0; i < pieces.length; i++) {
                            if(pieces[i].id == id) {
                                const oppoMoves = this[pieces[i].type](id, j, i, board, {row: move.row, col: move.col});

                                break;
                            }
                        }
                        // this[pieces[i].type](id, row, col, board, lastMove);
                        
                    }
                }
            }
            board[col][row] = id;
            board[move.col][move.row] = oldSqaure;
            legalmoves.push(move);
        }
        return legalmoves;
    }
}
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
            this.addMove(moves, dir, {row: row, col: col}, {row: row, col: col - dir}, board);
            if(col == pawnvals.startCol && board[col - dir * 2][row] == 0) {
                this.addMove(moves, dir, {row: row, col: col}, {row: row, col: col - dir * 2}, board);
            }
        }
        let s = board[col - dir][row - 1];
        if(s != 0 && this.oppoSide(dir, s)) {
            this.addMove(moves, dir, {row: row, col: col}, {row: row - 1, col: col - dir}, board);
        }
        s = board[col - dir][row + 1];
        if(s != 0 && this.oppoSide(dir, s)) {
            this.addMove(moves, dir, {row: row, col: col}, {row: row + 1, col: col - dir}, board);
        }
        s = board[col][row - 1];

        let oppoPawnVals = this.pawnData(dir * -1, b.rows, b.cols);
        if(lastMove != null) {
            if(lastMove.id == -dir && lastMove.orgCol + dir * 2 == lastMove.col && col == oppoPawnVals.enPassentCol && Math.abs(row - lastMove.row) == 1) {
                this.addMove(moves, dir, {row: row, col: col}, {row: lastMove.row, col: lastMove.orgCol + dir, extra: {type: "take", row: lastMove.row, col: lastMove.col}}, board);
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
                this.addMove(moves, id, {row: row, col: col}, {row: x, col: y}, board);
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
                        this.addMove(moves, id, {row: row, col: col}, {row: r, col: c}, board);
                    }
                    else if(this.oppoSide(id, board[c][r])) {
                        this.addMove(moves, id, {row: row, col: col}, {row: r, col: c}, board);
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
                        this.addMove(moves, id, {row: row, col: col}, {row: r, col: c}, board);
                    }
                    else if(this.oppoSide(id, board[c][r])) {
                        this.addMove(moves, id, {row: row, col: col}, {row: r, col: c}, board);
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
    static king(id, row, col, board, lastMove, castlingVals) {
        const offsetsKing = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
        var moves = [];
        for (var i = 0; i < offsetsKing.length; i++) {
            const x = row + offsetsKing[i][0];
            const y = col + offsetsKing[i][1];
            if(this.onBoard(x, y, board) && (this.oppoSide(board[y][x], id) || board[y][x] == 0)) {
                this.addMove(moves, id, {row: row, col: col}, {row: x, col: y}, board);
            }
        }
        //Castling
        if(!this.inCheck(id, board) && board[col][row + 1] == 0 && board[col][row + 2] == 0 && board[col][row + 3] * id == 24 && !this.kingOrRookMoved(id, row + 3, col, castlingVals)) {
            if(this.legalMove(id, {row: row, col: col}, {row: row + 1, col: col}, board)) {
                this.addMove(moves, id, {row: row, col: col}, {row: row + 2, col: col, extra: {type: "move", row: row + 3, col: col, moveRow: row + 1, moveCol: col}}, board);
            }
        }
        if(!this.inCheck(id, board) && board[col][row - 1] == 0 && board[col][row - 2] == 0 && board[col][row - 4] * id == 24  && !this.kingOrRookMoved(id, row - 4, col, castlingVals)) {
            if(this.legalMove(id, {row: row, col: col}, {row: row - 1, col: col}, board)) {
                this.addMove(moves, id, {row: row, col: col}, {row: row - 2, col: col, extra: {type: "move", row: row - 4, col: col, moveRow: row - 1, moveCol: col}}, board);
            }
        }
        console.log(castlingVals)
        return moves;
    }
    static kingOrRookMoved(id, row, col, castlingVals) {
        const vals = (id > 0) ? castlingVals["white"] : castlingVals["black"];
        for (let i = 0; i < vals.length; i++) {
            const obj = vals[i];
            if(obj.type == "king" && obj.moved) {
                return true;
            }
            else {
                if(row == obj.row && col == obj.col && obj.moved) {
                    return true;
                }
            }
        }
        return false;
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
    static addMove(moveArr, id, curpos, move, board) {
        if(this.legalMove(id, curpos, move, board)) {
            moveArr.push(move);
        }
    }
    static legalMove(id, curpos, move, board) {
        const tempTake = board[move.col][move.row];
        board[move.col][move.row] = id;
        board[curpos.col][curpos.row] = 0;
        if(move.extra != null) {
            if(move.type = "take") {
                var extraTake = board[move.extra.col][move.extra.row];
                board[move.extra.col][move.extra.row] = 0;
            }
        }
        if(this.inCheck(id, board)) {
            board[curpos.col][curpos.row] = id;
            board[move.col][move.row] = tempTake;
            if(extraTake != null) {
                board[move.extra.col][move.extra.row] = extraTake;
            }
            return false;
        }
        board[curpos.col][curpos.row] = id;
        board[move.col][move.row] = tempTake;
        if(extraTake != null) {
            board[move.extra.col][move.extra.row] = extraTake;
        }
        return true;
    }
    static inCheck(id, board) {
        const kingLocation = this.findKing(board, id);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const sqaure = board[i][j];
                if(sqaure != 0 && this.oppoSide(sqaure, id)) {

                    for (let k = 0; k < pieces.length; k++) {
                        if(pieces[k].id == sqaure) {
                            if(this[pieces[k].type + "Move"](sqaure, j, i, kingLocation.row, kingLocation.col, board)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    static findKing(board, id) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if(Math.abs(board[i][j]) == 6 &&  id * board[i][j] > 0) {
                    return {row: j, col: i}
                }                
            }
        }
    }
    static pawnMove(dir, row, col, kingRow, kingCol) {
        if(Math.abs(kingRow - row) == 1 && col - dir == kingCol) {
            return true;
        }
        return false;
    }
    static knightMove(id, row, col, kingRow, kingCol) {
        if((Math.abs(row - kingRow) == 1 && Math.abs(col - kingCol) == 2) || (Math.abs(row - kingRow) == 2 && Math.abs(col - kingCol) == 1)) {
            return true;
        }
        return false;
    }
    static bishopMove(id, row, col, kingRow, kingCol, board) {
        if(Math.abs(col - kingCol) == Math.abs(row - kingRow)) {
            const moveVec = {x: (row - kingRow)/Math.abs(col - kingCol), y: (col - kingCol)/Math.abs(col - kingCol)}
            for (let i = 1; i < Math.abs(row - kingRow); i++) {
                if(board[col - moveVec.y * i][row - moveVec.x * i] != 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    // hello future me the prob is board[col - moveVec.y * i] equal to 9
    static rookMove(id, row, col, kingRow, kingCol, board) {
        if(col == kingCol || row == kingRow) {
            const moveVec = (col === kingCol) ? { x: (row - kingRow)/Math.abs(row - kingRow), y: 0 } : { x: 0, y: (col - kingCol)/Math.abs(col - kingCol) };
            const limit = (col === kingCol) ? Math.abs(row - kingRow) : Math.abs(col - kingCol);
            for (let i = 1; i < limit; i++) {
                if(board[col - moveVec.y * i][row - moveVec.x * i] != 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    static queenMove(id, row, col, kingRow, kingCol, board) {
        if(this.bishopMove(id, row, col, kingRow, kingCol, board) || this.rookMove(id, row, col, kingRow, kingCol, board)) {
            return true;
        }
        return false;
    }
    static kingMove(id, row, col, kingRow, kingCol, board) {
        if(Math.abs(row - kingRow) <= 1 && Math.abs(col - kingCol) <= 1) {
            return true;
        }
    }
}



  
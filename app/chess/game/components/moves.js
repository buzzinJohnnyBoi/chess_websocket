export class moves {
    static pawn(dir, row, col, board, prevboard) {
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

        // let oppoPawnVals = this.pawnData(dir * -1, b.rows, b.cols);
        // console.log(-s == dir);
        // console.log(col == oppoPawnVals.enPassentCol);
        // console.log(prevboard[col][row - 1] == 0);
        // console.log(prevboard);
        // if(-s == dir && col == oppoPawnVals.enPassentCol && prevboard[col][row - 1] == 0 && prevboard[col + dir][row - 1] == 0) {
        //     moves.push({row: row - 1, col: col - dir});
        // }

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
        var offsetsBishop = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
        for(var i = 0; i < offsetsBishop.length; i++) {
            let offBoard = false;
            let r = row + offsetsBishop[i][0];
            let c = col + offsetsBishop[i][1];
            while(!offBoard) {
                
            }
        }
    }
    static rook(id, row, col, board) {
        
    }
    static queen(id, row, col, board) {
        
    }
    static king(id, row, col, board) {
        
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
}
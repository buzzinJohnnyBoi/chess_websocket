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
            moves.push({row: col - dir, col: row - 1});
        }
        s = board[col - dir][row + 1];
        if(s != 0 && this.oppoSide(dir, s)) {
            moves.push({row: col - dir, col: row + 1});
        }
        return moves;
    }
    static knight(id, row, col, board) {
        
    }
    static bishop(id, row, col, board) {
        
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
}
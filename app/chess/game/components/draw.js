import Piece from "./pieces.js";

export class draw {
    static Board(board, size, ctx, selectedPiece) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const sqaure = board[i][j];
                if(sqaure != 0) {
                    if(!(selectedPiece != null && (selectedPiece.row == j && selectedPiece.col == i))) {
                        this.Piece(sqaure, size, i, j, ctx);
                    }
                }
            }
        }
        if(selectedPiece != null) {
            for (let i = 0; i < selectedPiece.moves.length; i++) {
                const m = selectedPiece.moves[i];
                ctx.fillStyle = "rgba(20, 20, 20, 0.5)";
                ctx.fillRect(m.row * size.w, m.col * size.h, size.w, size.h);
            }
            this.Piece(selectedPiece.id, size, selectedPiece.y/size.h, selectedPiece.x/size.w, ctx);
        }
    }
    static Piece(piece, size, col, row, ctx) {
        ctx.drawImage(Piece.getDrawImage(piece), size.w * row, size.h * col, size.w, size.h);
    }
    static promoteScreen(row, col, size, color, ctx, idArr, reverseDraw = false) {
        const height = idArr.length * size.h;
        ctx.fillStyle = color;
        if(!reverseDraw) {
            ctx.fillRect(row * size.w, col * size.h, size.w, height);
        }
        else {
            ctx.fillRect(row * size.w, (col + 1) * size.h, size.w, -height);
        }
        for (let i = 0; i < idArr.length; i++) {
            const piece = idArr[i];
            if(!reverseDraw) {
                this.Piece(piece, size, col + i, row, ctx);
            }
            else {
                this.Piece(piece, size, col - i, row, ctx);
            }
        }
    }
}


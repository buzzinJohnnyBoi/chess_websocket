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
}


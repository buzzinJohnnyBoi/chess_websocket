import Piece from "./pieces.js";

export class draw {
    static Board(board, size, ctx, selectedPiece) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {

                
            }
        }
        if(selectedPiece != null) {
            this.Piece(selectedPiece.id, size, selectedPiece.y/size.h, selectedPiece.x/size.w, ctx);
        }
    }
    static Piece(piece, size, col, row, ctx) {
        ctx.drawImage(Piece.getDrawImage(piece), size.w * row, size.h * col, size.w, size.h);
    }
}


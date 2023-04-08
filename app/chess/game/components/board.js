import {draw} from "./draw.js";
import Piece from "./pieces.js";
import {pieces} from "./pieces.js";
import actions from "../app.js";

export class board {
    constructor(rows, cols, color1, color2, setup) {
        this.w = 0;
        this.h = 0;
        this.rows = rows;
        this.cols = cols;
        this.squareColors = [
            color1,
            color2
        ];
        this.color = null;
        this.turn = false;
        this.board = setup;
        this.lastMove = null;
        this.selectedPiece = null;
        this.castlingValues = this.castlingVals(setup);
        this.promotingVals = {
            promoting: false,
        }
    }

    castlingVals(setUp) {
        const kingId = this.findPieceId("king");
        const rookId = this.findPieceId("rook");
        let white = [];
        let black = [];
        for (let i = 0; i < setUp.length; i++) {
            for (let j = 0; j < setUp[i].length; j++) {
                const sqaure = setUp[i][j];
                if(Math.abs(sqaure) == kingId) {
                    if (sqaure < 0) {
                        black.push({type: "king", row: j, col: i, moved: false});
                    }
                    else {
                        white.push({type: "king", row: j, col: i, moved: false});
                    }
                }
                else if(Math.abs(sqaure) == rookId) {
                    if (sqaure < 0) {
                        black.push({type: "rook", row: j, col: i, moved: false});
                    }
                    else {
                        white.push({type: "rook", row: j, col: i, moved: false});
                    }
                }
            }
        }
        return {
            "white": white,
            "black": black,
        }
    }
    findPieceId(name) {
        for (let i = 0; i < pieces.length; i++) {
            if(pieces[i].type == name) {
                return pieces[i].id;
            }
        }
    }
    update(renderer, ctx, vw, vh, mx, my) {
        if(vh < vw) {
            var size = vh;
            renderer.style.left = (vw - size)/2 + "px";
            renderer.style.top = "0px";
        }
        else {
            var size = vw;
            renderer.style.top = (vh - size)/2 + "px";
            renderer.style.left = "0px";
        }
        renderer.width = size;
        renderer.height = size;
        this.w = size;
        this.h = size;
        this.draw(ctx);
        if(this.selectedPiece != null) {
            this.selectedPiece.x = clamp(0, this.w - size/this.rows, mx - size/(2 * this.rows));
            this.selectedPiece.y = clamp(0, this.h - size/this.cols, my - size/(2 * this.cols));
        }
        if(this.promotingVals.promoting) {
            draw.promoteScreen(this.promotingVals.row, this.promotingVals.col, {w: size/this.rows, h: size/this.cols}, this.promotingVals.color, ctx, this.promotingVals.pieceId, (this.promotingVals.col === 0) ? false : true);
        }
    }
    draw(ctx) {
        const w = this.w/this.rows;
        const h = this.h/this.cols;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                ctx.fillStyle = this.squareColors[(i + j) % 2];
                ctx.fillRect(i * w, j * h, w, h);      
            }
        }
        draw.Board(this.board, {w: w, h: h}, ctx, this.selectedPiece);
    }
    onclick(x, y) {
        if(this.selectedPiece == null && !this.promotingVals.promoting && this.turn == true) {
            const sqaure = this.findSquare(x, y);
            const piece = this.board[sqaure.col][sqaure.row];
            if(piece != 0 && this.sameTeam(piece)) {
                const p = (this.color == "white") ? {row: sqaure.row, col: sqaure.col} : this.reverseSquare(sqaure.row, sqaure.col);
                this.selectedPiece = {
                    x: x - this.w/(2 * this.rows),
                    y: y - this.h/(2 * this.cols),
                    row: sqaure.row,
                    col: sqaure.col,
                    id: piece,
                    moves: Piece.getMoves(piece, p.row, p.col, (this.color == "white") ? this.board : this.reverseBoard(), this.lastMove, this.castlingValues, this.color)
                }
                if(this.color != "white") {
                    for (let i = 0; i < this.selectedPiece.moves.length; i++) {
                        const move = this.selectedPiece.moves[i];
                        this.reverseMove(move);
                    }
                }
                // console.log(this.reverseBoard())
            }
        }
        else if(this.promotingVals.promoting == true) {            
            const sqaure = this.findSquare(x, y);
            if(this.promotingVals.row == sqaure.row) {
                const h = this.h/this.cols;
                if(Math.abs(sqaure.col - this.promotingVals.col) < this.promotingVals.pieceId.length) {
                    this.board[this.promotingVals.col][this.promotingVals.row] = this.promotingVals.pieceId[Math.abs(sqaure.col - this.promotingVals.col)];
                    this.promotingVals = {
                        promoting: false,
                    }
                    actions.move((this.color == "white") ? this.board : this.reverseBoard());
                    this.turn = false;
                }
            }
        }
    }
    sameTeam(piece) {
        if((piece < 0 && this.color == "black") || (piece > 0 && this.color == "white")) {
            return true;
        }
        return false;
    }
    onrelease(x, y) {
        if(this.selectedPiece != null) {
            const sqaure = this.findSquare(x, y);
            const move = this.moveInMoves(sqaure.row, sqaure.col);
            if(move !== false) {
                const org = (this.color == "white") ? {row: this.selectedPiece.row, col: this.selectedPiece.col} : this.reverseSquare(this.selectedPiece.row, this.selectedPiece.col);
                const coord = (this.color == "white") ? {row: sqaure.row, col: sqaure.col} : this.reverseSquare(sqaure.row, sqaure.col);
                this.lastMove = {
                    id: this.selectedPiece.id,
                    orgRow: org.row,
                    orgCol: org.col,
                    row: coord.row,
                    col: coord.col,
                };
                this.board[this.selectedPiece.col][this.selectedPiece.row] = 0;
                this.board[sqaure.col][sqaure.row] = this.selectedPiece.id;
                this.selectedPiece.newrow = sqaure.row;
                this.selectedPiece.newcol = sqaure.col;
                if(move.extra != null) {
                    if(move.extra.type == "move") {
                        this.board[move.extra.moveCol][move.extra.moveRow] = this.board[move.extra.col][move.extra.row];
                        this.board[move.extra.col][move.extra.row] = 0;
                    }
                    else if(move.extra.type == "take") {
                        this.board[move.extra.col][move.extra.row] = 0;
                    }
                    else if(move.extra.type == "promote") {
                        this.promotingVals = {
                            promoting: true,
                            pieceId: [5 * move.extra.pieceColor, 2  * move.extra.pieceColor, 4  * move.extra.pieceColor, 3  * move.extra.pieceColor],
                            color: "rgba(255, 255, 255, 0.9)",
                            row: sqaure.row,
                            col: sqaure.col,
                        }
                    }
                }
                if(Math.abs(this.selectedPiece.id) == this.findPieceId("king")) {
                    const vals = (this.selectedPiece.id > 0) ? this.castlingValues["white"] : this.castlingValues["black"];
                    for (let i = 0; i < vals.length; i++) {
                        if(vals[i].type == "king") {
                            vals[i].moved = true;
                            break;
                        }
                    }
                }
                if(Math.abs(this.selectedPiece.id) == this.findPieceId("rook")) {
                    const vals = (this.selectedPiece.id > 0) ? this.castlingValues["white"] : this.castlingValues["black"];
                    for (let i = 0; i < vals.length; i++) {
                        if(vals[i].type == "rook") {
                            if(sqaure.row == vals[i].row && sqaure.col == vals[i].col) {
                                vals[i].moved = true;
                            }
                        }
                    }
                }
                if(move.extra != null) {
                    if(move.extra.type != "promote") {
                        this.turn = false;
                        actions.move((this.color == "white") ? this.board : this.reverseBoard());
                    }
                }
                else {
                    this.turn = false;
                    actions.move((this.color == "white") ? this.board : this.reverseBoard());
                }
                this.selectedPiece = null;
            }
            else {
                this.setBack();
            }
        }
    }
    moveInMoves(row, col) {
        for (let i = 0; i < this.selectedPiece.moves.length; i++) {
            if(this.selectedPiece.moves[i].row == row && this.selectedPiece.moves[i].col == col) {
                return this.selectedPiece.moves[i];
            }
        }
        return false;
    }
    setBoard(board) {
        this.board = (this.color == "white") ? board : this.reverseBoard(board);
        this.turn = true;
    }
    setColor(color) {
        this.color = color;
        if(color == "black") {
            this.board = this.reverseBoard();
        }
        else {
            this.turn = true;
        }
    }
    reverseBoard(board) {
        const b = (board == null) ? this.board : board;
        let newBoard = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for (let i = b.length - 1; i >= 0; i--) {
            for (let j = b[i].length - 1; j >= 0; j--) {
                newBoard[7 - i].push(b[i][j]);                
            }
        }
        return newBoard;
    }
    reverseSquare(row, col) {
        return { row: (this.rows - 1) - row, col: (this.cols - 1) - col }
    }
    reverseMove(move) {
        move.row = (this.rows - 1) - move.row, 
        move.col = (this.cols - 1) - move.col;
        if(move.extra != null) {
            if(move.extra.type == "take") {
                move.extra.row = (this.rows - 1) - move.extra.row, 
                move.extra.col = (this.cols - 1) - move.extra.col;
            }
            else if(move.extra.type == "move") {
                move.extra.row = (this.rows - 1) - move.extra.row, 
                move.extra.col = (this.cols - 1) - move.extra.col;
                move.extra.moveRow = (this.rows - 1) - move.extra.moveRow;
                move.extra.moveCol = (this.cols - 1) - move.extra.moveCol;
            }
        }
    }
    setBack() {
        if(this.selectedPiece != null) {
            this.selectedPiece = null;
        }
    }
    findSquare(x, y) {
        const w = this.w/this.rows;
        const h = this.h/this.cols;
        return {
            row: Math.floor(x/w),
            col: Math.floor(y/h)
        }
    }
}

// const socket = io('https://getdata.johntheguy.tk');


// function move(selectedPiece) {
//     socket.emit('move', selectedPiece);
// }

function clamp(min, max, val) {
    if(val < min ) return min;
    if(val > max ) return max;
    return val;
}
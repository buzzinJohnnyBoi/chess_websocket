import {draw} from "./draw.js";
import Piece from "./pieces.js";
import {pieces} from "./pieces.js";

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
        this.board = setup;
        this.lastMove = null;
        this.selectedPiece = null;
        this.castlingValues = this.castlingVals(setup);
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
        if(this.selectedPiece == null) {
            const sqaure = this.findSquare(x, y);
            const piece = this.board[sqaure.col][sqaure.row];
            if(piece != 0) {
                this.selectedPiece = {
                    x: x - this.w/(2 * this.rows),
                    y: y - this.h/(2 * this.cols),
                    row: sqaure.row,
                    col: sqaure.col,
                    id: piece,
                    moves: Piece.getMoves(piece, sqaure.row, sqaure.col, this.board, this.lastMove, this.castlingValues)
                }
            }
        }
    }
    onrelease(x, y) {
        if(this.selectedPiece != null) {
            const sqaure = this.findSquare(x, y);
            const move = this.moveInMoves(sqaure.row, sqaure.col);
            if(move !== false) {
                this.lastMove = {
                    id: this.selectedPiece.id,
                    orgRow: this.selectedPiece.row,
                    orgCol: this.selectedPiece.col,
                    row: sqaure.row,
                    col: sqaure.col,
                };
                if(move.extra != null) {
                    if(move.extra.type == "move") {
                        this.board[move.extra.moveCol][move.extra.moveRow] = this.board[move.extra.col][move.extra.row];
                        this.board[move.extra.col][move.extra.row] = 0;
                    }
                    else if(move.extra.type == "take") {
                        this.board[move.extra.col][move.extra.row] = 0;
                    }
                    console.log(move.extra)
                }
                this.board[this.selectedPiece.col][this.selectedPiece.row] = 0;
                this.board[sqaure.col][sqaure.row] = this.selectedPiece.id;
                this.selectedPiece.newrow = sqaure.row;
                this.selectedPiece.newcol = sqaure.col;
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
                // move(this.selectedPiece);
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
    moveP(row, col, id, newrow, newcol) {
        // this.board[col][row] = 0;
        // this.board[newcol][newrow] = id;
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

const socket = io('https://getdata.johntheguy.tk');


function move(selectedPiece) {
    socket.emit('move', selectedPiece);
}

function clamp(min, max, val) {
    if(val < min ) return min;
    if(val > max ) return max;
    return val;
}
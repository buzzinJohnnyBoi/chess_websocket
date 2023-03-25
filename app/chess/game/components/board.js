import {draw} from "./draw.js";
import Piece from "./pieces.js";
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
                    moves: Piece.getMoves(piece, sqaure.row, sqaure.col, this.board, this.lastMove)
                }
            }
        }
    }
    onrelease(x, y) {
        if(this.selectedPiece != null) {
            const sqaure = this.findSquare(x, y);
            this.lastMove = {
                id: this.selectedPiece.id,
                orgRow: this.selectedPiece.row,
                orgCol: this.selectedPiece.col,
                row: sqaure.row,
                col: sqaure.col,
            };
            console.log(this.lastMove)
            this.board[this.selectedPiece.col][this.selectedPiece.row] = 0;
            this.board[sqaure.col][sqaure.row] = this.selectedPiece.id;
            this.selectedPiece.newrow = sqaure.row;
            this.selectedPiece.newcol = sqaure.col;
            // move(this.selectedPiece);
            this.selectedPiece = null;
        }
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
// const wp = document.querySelector("#whitePawn");
import {moves} from './moves.js';

export default class piece {
    static getDrawImage(id) {
        for (let i = 0; i < pieces.length; i++) {
            if(pieces[i].id == id) {
                return pieces[i].image;
            }
        }
        return false;
    }
    static getMoves(id, row, col, board, lastMove) {
        for (let i = 0; i < pieces.length; i++) {
            if(pieces[i].id == id) {
                return moves[pieces[i].type](id, row, col, board, lastMove);
            }
        }
    }
}


export const pieces = [
    //white pieces
    {
        id: 1,
        type: "pawn",
        color: "white",
        image: document.querySelector("#whitePawn"),
    },
    {
        id: 2,
        type: "knight",
        color: "white",
        image: document.querySelector("#whiteKnight"),
    },
    {
        id: 3,
        type: "bishop",
        color: "white",
        image: document.querySelector("#whiteBishop"),
    },
    {
        id: 4,
        type: "rook",
        color: "white",
        image: document.querySelector("#whiteRook"),
    },
    {
        id: 5,
        type: "queen",
        color: "white",
        image: document.querySelector("#whiteQueen"),
    },
    {
        id: 6,
        type: "king",
        color: "white",
        image: document.querySelector("#whiteKing"),
    },
    //black pieces
    {
        id: -1,
        type: "pawn",
        color: "white",
        image: document.querySelector("#blackPawn"),
    },
    {
        id: -2,
        type: "knight",
        color: "white",
        image: document.querySelector("#blackKnight"),
    },
    {
        id: -3,
        type: "bishop",
        color: "white",
        image: document.querySelector("#blackBishop"),
    },
    {
        id: -4,
        type: "rook",
        color: "white",
        image: document.querySelector("#blackRook"),
    },
    {
        id: -5,
        type: "queen",
        color: "white",
        image: document.querySelector("#blackQueen"),
    },
    {
        id: -6,
        type: "king",
        color: "white",
        image: document.querySelector("#blackKing"),
    },
]
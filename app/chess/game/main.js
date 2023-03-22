import {board} from "./components/board.js";
// import {chess} from "./game.js";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
const defaultSetup = [
  [-4, -2, -3, -5, -6, -3, -2, -4],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [4, 2, 3, 5, 6, 3, 2, 4]
]


var board1 = new board(8, 8, "tan", "brown", defaultSetup);
board1.update(canvas, ctx, window.innerWidth, window.innerHeight);

// var game = new chess(new board(8, 8, "tan", "brown", defaultSetup), [0, 1]);

function UpdateBoard() {
  const x = mouse.x - parseInt(canvas.style.left);
  const y = mouse.y - parseInt(canvas.style.top);
  board1.update(canvas, ctx, window.innerWidth, window.innerHeight, x, y);
}

setInterval(UpdateBoard, 1000/60);

function mouseMove() {
  if(mouse.pressed) {
  }
}

function mouseDown() {
  if(mouse.pressed) {
    const x = mouse.x - parseInt(canvas.style.left);
    const y = mouse.y - parseInt(canvas.style.top);
    // console.log(parseInt(canvas.width) + parseInt(canvas.style.left))
    if(x >= 0 && y >= 0 && x <= parseInt(canvas.width) && y <= parseInt(canvas.height)) {
      board1.onclick(x, y);
    }
  }
}

function mouseUp() {
  const x = mouse.x - parseInt(canvas.style.left);
  const y = mouse.y - parseInt(canvas.style.top);
  if(x >= 0 && y >= 0 && x <= parseInt(canvas.width) && y <= parseInt(canvas.height)) {
    board1.onrelease(x, y);
  }
  else {
    board1.setBack();
  }
}


var mouse = {
  pressed: false,
  x: 0,
  y: 0
}

function MouseUp(e) {
  if(mouse.pressed == true) {
      mouse.pressed = false;
      mouseUp();
  }
}
function MouseDown(e) {
  if(mouse.pressed == false) {
      mouse.pressed = true;
      mouseDown();
  }
}

function MouseMove(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  mouseMove();
}

document.addEventListener("mouseup", MouseUp);
document.addEventListener("mousedown", MouseDown);
document.addEventListener("mousemove", MouseMove);

const socket = io('https://getdata.johntheguy.tk');

socket.on('move', move => {
  console.log(move)
  // board1.board[move.col][move.row] = move.id;
  board1.moveP(move.row, move.col, move.id, move.newrow, move.newcol)
  console.log(board1)
});

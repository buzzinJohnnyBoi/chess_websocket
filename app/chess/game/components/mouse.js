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
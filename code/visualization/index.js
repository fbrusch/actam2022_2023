

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// we move drawing into a function, and define a "state" of the rectangle

var x = 0;
var y = 0;
var vx = 0.001;
var vy = 0;//0.001;
var w = 150;
var h = 150;

function evolveWorld(dt) {
    x += vx*dt;
    y += vy*dt;
    if(x+w > canvas.width) {vx = -vx;}
}

function render() {
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.rect(x,y,w,h);
    context.stroke();
}

function tick(dt) {
    evolveWorld(dt);
    render();
    window.requestAnimationFrame(tick);
}

tick(0)
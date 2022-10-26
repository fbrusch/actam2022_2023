




const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// we move drawing into a function, and define a "state" of the rectangle

var x = 0;
var y = 0;
var vx = 0.1;
var vy = 0.0;
var gravity = 0.001;
var absorbY = 0.1;
var w = 150;
var h = 150;
var previousTimeStamp;

function evolveWorld(timeStamp) {
    var deltaTime;

    deltaTime = previousTimeStamp ? timeStamp - previousTimeStamp : 0
    previousTimeStamp = timeStamp;

    
    // definition of velocity
    x += vx*deltaTime;
    y += vy*deltaTime;

    // gravity

    vy += gravity;


    if(x+w > canvas.width) {
        vx = -vx; 
        x = canvas.width - w;
    }
    if(x < 0) {
        vx = -vx; x = 0;
    }
    if(y+h > canvas.height) {
        vy = -vy; 
        y = canvas.height - h;
        vy *= 1-absorbY;
        console.log(vy);
    }
    if(y < 0) {vy = -vy; y = 0;}
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


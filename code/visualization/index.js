
var c = new AudioContext();
var o = c.createOscillator();
var g = c.createGain();
var attack = 0.01;
var release = 0.4;
o.start();
o.connect(g);
g.connect(c.destination);
g.gain.setValueAtTime(0, c.currentTime);
var cmp = c.createDynamicsCompressor();
cmp.connect(c.destination);

function kick() {
    var o = c.createOscillator();
    var g = c.createGain();
    o.connect(g);
    g.connect(cmp);
    o.start();
    o.frequency.setValueAtTime(100, c.currentTime);
    o.frequency.linearRampToValueAtTime(0, c.currentTime + 0.1);
    g.gain.setValueAtTime(2, c.currentTime);
    g.gain.linearRampToValueAtTime(0, c.currentTime + 0.1);
}

function play(f) {
    var o = c.createOscillator();
    o.type = "square";
    var g = c.createGain();
    o.start();
    o.connect(g);
    g.connect(cmp);
    o.frequency.setValueAtTime(f, c.currentTime);
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(1, c.currentTime + attack);
    g.gain.linearRampToValueAtTime(0, c.currentTime+attack+release);
}

document.body.onclick = () => c.resume();

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// we move drawing into a function, and define a "state" of the rectangle

var x = 3;
var y = 2;
var vx = 0.3;
var vy = 0.2;
var gravity = 0.01;
var absorbY = 0.3;
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
        kick();
    }
    if(x < 0) {
        vx = -vx; x = 0;
        kick();
    }
    if(y+h > canvas.height) {
        vy = -vy; 
        y = canvas.height - h;
        vy *= 1-absorbY;
        kick();
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


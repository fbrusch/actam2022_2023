var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext("2d");

context.moveTo(0,0);
context.lineTo(100,100);
context.stroke();

var c = new AudioContext();
var o = c.createOscillator();
var a = c.createAnalyser();

o.connect(a);
a.connect(c.destination);
o.start();

a.fftSize = 2048;
const bufferLenght = a.frequencyBinCount;
const array = new Float32Array(bufferLenght);

function draw() {
    requestAnimationFrame(draw);
    a.getFloatTimeDomainData(array);
    context.clearRect(0,0,canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0,0);
    for(let i = 0; i < array.length; i++) {
        context.lineTo(i,array[i]*canvas.height/2 + canvas.height/2);
        //context.lineTo(i, Math.random()*100);
    }
    context.stroke()
}

document.onclick = () => 
{
    c.resume();
    draw();
}

document.onkeydown = function(e) {
    if (e.key == "w") {
        o.frequency.value *= 1.1;
    }
    if (e.key == "s") {
        o.frequency.value *= 0.9;
    }
    if (e.key == "q") {
        o.type = ["sine","square","trinagle","sawtooth"][Math.floor(Math.random)*4]
    }
}



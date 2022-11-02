

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("oscilloscope");

var context = canvas.getContext("2d");

context.moveTo(0,0);
context.lineTo(100,100);
context.stroke();


var c = new AudioContext();
var a = c.createAnalyser();
var o = c.createOscillator();
o.connect(a);
a.connect(c.destination);


var buffer = new Float32Array(500);


document.onclick = () => {
    c.resume();
    o.type = "square";
    o.start();
    // sample what the analyser sees
    // and show it on the canvas
    setTimeout( sampleAndDraw,
    1000);
}

function sampleAndDraw() {
    a.getFloatTimeDomainData(buffer);
    context.moveTo(0,0);
    for(let i=0;i<500;i++) {
        context.lineTo(i, (buffer[i]+1)*50)
    }
    context.stroke();
}

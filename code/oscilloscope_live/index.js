

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("oscilloscope");

var context = canvas.getContext("2d");

context.moveTo(0,0);
context.lineTo(100,100);
context.stroke();


var c = new AudioContext();
var a = c.createAnalyser();
var o = c.createOscillator();
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
var bs = c.createBufferSource();
bs.loop = true;

var wnBuffer = c.createBuffer(1,
    c.sampleRate*1, c.sampleRate);

var bufferData = wnBuffer.getChannelData(0);

for(let i=0;i<bufferData.length;i++) {
   var sample = Math.sin(i/10);
   if (Math.abs(sample) < 0.3) {
    bufferData[i] = 1.3*sample;
   } else {
    bufferData[i] = 1*3*0.3*Math.sign(sample);
   }

}

bs.buffer = wnBuffer;
bs.connect(a);

o.connect(a);
a.connect(c.destination);


var buffer = new Float32Array(500);


document.onclick = () => {
    c.resume();
    //o.type = "square";
    bs.start();
    //o.start();
    // sample what the analyser sees
    // and show it on the canvas
    setInterval( sampleAndDraw,
    20);
}

function sampleAndDraw() {
    a.getFloatTimeDomainData(buffer);
    context.clearRect(0,0,500,100);
    context.beginPath();
    context.moveTo(0,0);
    for(let i=0;i<500;i++) {
        context.lineTo(i, (buffer[i]+1)*50)
    }
    context.stroke();
}

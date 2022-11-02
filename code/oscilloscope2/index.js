

/**  @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");

var context = canvas.getContext("2d");

var c = new AudioContext();

var buffer = c.createBuffer(1, c.sampleRate, c.sampleRate);

var bufferData = buffer.getChannelData(0);

for(let i=0;i<bufferData.length; i++) {
    bufferData[i] = Math.random();
}

var a = c.createAnalyser();
a.connect(c.destination);


const bs = c.createBufferSource()
bs.buffer = buffer;
//bs.loop = true;
bs.connect(c.destination);

document.onclick = () => 

{
    c.resume();
    navigator.mediaDevices.getUserMedia({audio:true}).then(connectStream);
    draw();
}

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

function  connectStream(stream) {
    var streamDevice = c.createMediaStreamSource(stream);
    streamDevice.connect(a);

}




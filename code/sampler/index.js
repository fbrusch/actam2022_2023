var c = new AudioContext();

var sp = c.createScriptProcessor();


var b = c.createBuffer(1, 10*c.sampleRate, c.sampleRate);

var audioData = b.getChannelData(0);

/** @type HTMLCanvasElement */
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
/** @type integer */
var index = 0;

var recording = true;

var selection = {start:0, end:100}

sp.onaudioprocess = function(event) {
    let inputBuffer = event.inputBuffer;
    let outputBuffer = event.outputBuffer;

    let inputData = inputBuffer.getChannelData(0);
    let outputData = outputBuffer.getChannelData(0);

    for(let i=0;i<inputData.length;i++) {
        //outputData[i] = inputData[i];
        if(recording) {
            audioData[index] = inputData[i];
            index = (index + 1) % audioData.length;
        }
    }
}

function drawBuffer() {
    window.requestAnimationFrame(drawBuffer);
    var w = canvas.width;
    var h = canvas.height;
    context.clearRect(0,0,w,h);
    
    context.beginPath();
    context.rect(selection.start,0,selection.end-selection.start,h);
    context.moveTo(0,h/2);
    for(let i=0;i<w;i++) {
        context.lineTo(i, audioData[Math.floor(i/w*audioData.length)]*h/2+h/2)
    }
    context.moveTo(index/audioData.length*w,0);
    context.lineTo(index/audioData.length*w,h);
    context.stroke()
}




drawBuffer();

async function main() {
    let userMedia = await navigator.mediaDevices.getUserMedia({audio:true})
    let ss = c.createMediaStreamSource(userMedia);
    ss.connect(sp);

} 

var dragging = false;

document.onmousedown = (e) => {
    if(e.clientX > canvas.width) return;
    selection.start = e.clientX;
    selection.end = e.clientX;
    dragging = true;
}
document.onmouseup = (e) => {dragging = false}

document.onmousemove = (e) => {
    if(dragging) {
        selection.end = e.clientX;
        console.log(e.clientX);
    }
}

var bs = c.createBufferSource();
bs.buffer = b;

document.getElementById("stop").onclick = () => recording = !recording;
document.getElementById("play").onclick = () => play(3)

function play(rate)
{
    var l = Math.floor(Math.abs(selection.end-selection.start)/canvas.width*b.length);
    var buffer = c.createBuffer(1, l, c.sampleRate);
    var start = selection.start/canvas.width*b.length;
    var end = selection.end/canvas.width*b.length;
    var ad = buffer.getChannelData(0);
    for(let i=0;i<ad.length;i++) {
        ad[i] = audioData[start+Math.floor((end-start)/l)*i]
    }
    var bs = c.createBufferSource();
    bs.buffer = buffer;
    bs.playbackRate.value = rate;
    bs.connect(c.destination);
    bs.start();
}


const keys = "awsedftgyhujk";
document.onkeydown = (e) => play(Math.pow(2,keys.indexOf(e.key)/12));

document.onclick = function () {
var o = c.createOscillator();
o.connect(sp);
sp.connect(c.destination);
c.resume();
main();
}

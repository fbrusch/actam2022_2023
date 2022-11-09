

var c = new AudioContext();
var o = c.createOscillator();
var sp = c.createScriptProcessor(1024, 1, 1);
var recordBuffer = c.createBuffer(1, 5*c.sampleRate, c.sampleRate);
var recordAudioData = recordBuffer.getChannelData(0);

/** @type HTMLCanvasElement */
var canvas = document.getElementById("osc");

const context = canvas.getContext("2d");

function drawSound() {
    window.requestAnimationFrame(drawSound);
    const h = canvas.height;
    const w = canvas.width;
    context.clearRect(0,0,w,h);
    context.beginPath();
    context.moveTo(0, h/2);
    for(let i=0;i<recordAudioData.length;i++) {
        context.lineTo(i, 
            recordAudioData[Math.floor(i*recordAudioData.length/w)]*h/2 + h/2);
    }



    context.stroke()
}

drawSound();

var index = 0;

o.connect(sp);
sp.connect(c.destination);

sp.onaudioprocess = function(e) {
    let inputBuffer = e.inputBuffer;
    let outputBuffer  = e.outputBuffer;

    let audioDataIn = inputBuffer.getChannelData(0);
    let audioDataOut = outputBuffer.getChannelData(0);

    for(let i=0;i < audioDataIn.length; i++) {
        recordAudioData[index] = audioDataIn[i];
        index += 1;
        if(index > recordAudioData.length) index = 0;
    }

}

o.start();

document.onclick = () => c.resume()

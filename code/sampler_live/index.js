

var c = new AudioContext();
var o = c.createOscillator();
var sp = c.createScriptProcessor(1024, 1, 1);
var recordBuffer = c.createBuffer(1, 5*c.sampleRate, c.sampleRate);
var recordAudioData = recordBuffer.getChannelData(0);

var recording = true;

var clip = {start: 1000, end: 10000};

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

    // draw a line in the recording position
    //context.moveTo(index*recordAudioData.length/w,0);
    //context.lineTo(index*recordAudioData.length/w,h);
    context.moveTo(index*w/recordAudioData.length,0);
    context.lineTo(index*w/recordAudioData.length,h);
 
    context.rect(clip.start*w/recordAudioData.length,0,
                 clip.end*w/recordAudioData.length,h)
    
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
        if(recording) {
            recordAudioData[index] = audioDataIn[i];
            index += 1;
            if(index > recordAudioData.length) index = 0;
        }
    }

}

//o.start();

document.onclick = main
document.getElementById("toggle").onclick = function() {
    recording = !recording;
}

async function main() {
    c.resume()
    const userAudio = await navigator.mediaDevices.getUserMedia({audio: true});
    const mss = c.createMediaStreamSource(userAudio);
    mss.connect(sp);
}

function playBack() {
    const bs = c.createBufferSource();
    bs.buffer = recordBuffer;
    bs.playbackRate.value = 1.5;
    bs.loopStart = clip.start/c.sampleRate; 
    bs.loopEnd = clip.end/c.sampleRate;
    bs.loop = true;
    bs.connect(c.destination);
    bs.start();
    
}

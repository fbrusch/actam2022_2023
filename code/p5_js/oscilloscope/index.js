const tone_oscillator = new Tone.Oscillator();
tone_oscillator.toDestination();
Tone.Master.volume.value = -9; //in decibels

let waveform = new Tone.Waveform();
tone_oscillator.connect(waveform);

let oscillatorTypes = ["sine","square","triangle","sawtooth"];
let bufferArray;

let canvas;

function setup(){
    canvas = createCanvas(500,200);
    canvas.style('border', '1px solid blue');
    console.log('setup');
}

function draw() {

    bufferArray = waveform.getValue(0);

    drawingContext.clearRect(0,0,canvas.width, canvas.height);
    drawingContext.beginPath();
    drawingContext.moveTo(0,0);

    for(let i = 0; i < bufferArray.length; i++) {

        drawingContext.lineTo(i, bufferArray[i]*canvas.height/2 + canvas.height/2);
    }
    drawingContext.stroke()
}

function startSound(){
    Tone.start();
    tone_oscillator.start();
}

document.onclick = () => {
    startSound();
    draw();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.onkeydown = function(e) {
    if (e.key === "w") {
        tone_oscillator.frequency.value *= 1.1;
    }
    if (e.key === "s") {
        tone_oscillator.frequency.value *= 0.9;
    }
    if (e.key === "q") {
        tone_oscillator.type = oscillatorTypes[getRandomInt(0,3)]
    }
    if (e.key === "n") {
        playNoise();
    }
}

function playNoise() {
    const bs = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
    bufferData = buffer.getChannelData(0);
    for(let i=0; i< bufferData.length; i++) {
        bufferData[i] = Math.random();
    }
    bs.buffer = buffer;
    bs.connect(analyzer);
    bs.start();
}



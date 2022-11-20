const tone_oscillator = new Tone.Oscillator();
tone_oscillator.toDestination();
Tone.Destination.volume.value = -9; //in decibels

let waveform = new Tone.Waveform();
tone_oscillator.connect(waveform);

let oscillatorTypes = ["sine","square","triangle","sawtooth"];
let bufferArray;


function setup(){
    createCanvas(windowWidth, windowHeight);
    console.log('setup');
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(110);
    stroke('black');
    strokeWeight(4);
    bufferArray = waveform.getValue(0);

    for(let i = 0; i < bufferArray.length; i++) {
        point(i, bufferArray[i]*windowHeight/2 + windowHeight/2);
    }

}

function startSound(){
    Tone.start();
    tone_oscillator.start();
}

document.onclick = () => {
    startSound();
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



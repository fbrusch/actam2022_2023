// import * as Tone from 'tone';

const tone_oscillator = new Tone.Oscillator();
tone_oscillator.toDestination();
Tone.Destination.volume.value = -13; //in decibels

let waveform = new Tone.Waveform();
tone_oscillator.connect(waveform);

let oscillatorTypes = ["sine","square","triangle","sawtooth"];
let bufferArray;
let noise = new Tone.Noise("white").toDestination();

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
    let x,y;

    /* 1. POINTS
    for(let i = 0; i < bufferArray.length; i++) {
        // Give me a value between 0 and windowWidth which is proportional to the value of i between 0 and buffer.length
        x = map(i,0,bufferArray.length, 0, windowWidth);
        // Waveform values go from -1 to 1
        y = map(bufferArray[i], -1,1,0, windowHeight);
        point(x,y);
    }*/

    let x1,y1,x2,y2;

    /* 2. LINE
    for(let i = 1; i < bufferArray.length; i++) {

        x1 = map(i-1,0,bufferArray.length, 0, windowWidth);
        y1 = map(bufferArray[i-1], -1,1,0, windowHeight);

        x2 = map(i,0,bufferArray.length, 0, windowWidth);
        y2 = map(bufferArray[i], -1,1,0, windowHeight);

        line(x1,y1, x2,y2);
    }
    */

    let start_point = 0;
    for(let i = 0; i < bufferArray.length; i++) {
        if (bufferArray[i - 1] < 0 && bufferArray[i] >= 0){
            start_point = i;
            break;
        }
    }

    let end_point = start_point + bufferArray.length/2;

    for(let i = start_point+1; i < end_point; i++) {

        x1 = map(i-1,start_point,end_point, 0, windowWidth);
        y1 = map(bufferArray[i-1], -1,1,0, windowHeight);

        x2 = map(i,start_point,end_point, 0, windowWidth);
        y2 = map(bufferArray[i], -1,1,0, windowHeight);

        line(x1,y1, x2,y2);
    }


}

function startSound(){
    Tone.start();
    tone_oscillator.start();
}

document.onclick = () => {
    startSound();
}



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

document.onkeyup = function(e){
    if (e.key === "n") {
        stopNoise();
    }
}

function playNoise() {
    tone_oscillator.stop();
    noise.start();
    noise.connect(waveform);
}

function stopNoise() {
    noise.stop();
    tone_oscillator.start();
    tone_oscillator.connect(waveform);

}



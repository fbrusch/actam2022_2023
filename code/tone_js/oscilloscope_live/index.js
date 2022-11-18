/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("oscilloscope");
var context = canvas.getContext("2d");


/* Creating a Tone Loop object with a callback a function*/
let tone_loop = new Tone.Loop(sampleAndDraw, 0.02); /*Second param is in seconds.*/


/*
* Making the audio data by hand.
* */
let bufferData = new Float32Array(44100);
let sample;
for(let i=0;i<bufferData.length;i++) {
   sample = Math.sin(i/10);
   if (Math.abs(sample) < 0.3) {
    bufferData[i] = 1.3*sample;
   } else {
    bufferData[i] = 1.3*0.3*Math.sign(sample);
   }
}

/*Option 2: Connecting the audio data to a player*/
let toneAudioBuffer = Tone.ToneAudioBuffer.fromArray(bufferData);
let tonePlayer = new Tone.Player();
tonePlayer.toDestination();
tonePlayer.buffer = toneAudioBuffer;
/*Looping the Player*/
tonePlayer.loop = true;

/*The analyser's part is made by the waveform class.*/
let toneWaveForm = new Tone.Waveform();
tonePlayer.connect(toneWaveForm);
let waveBufferData;



document.onclick = () => {
    Tone.start();
    Tone.Transport.start();

    tonePlayer.start();

    // sample what the analyser sees
    // and show it on the canvas
    tone_loop.start();

}


function sampleAndDraw(transport_time) {

    console.log(transport_time);

    waveBufferData = toneWaveForm.getValue(0);

    context.clearRect(0,0,500,100);
    context.beginPath();
    context.moveTo(0,0);
    for(let i=0;i<waveBufferData.length;i++) {
        context.lineTo(i, (waveBufferData[i]+1)*50)
    }
    context.stroke();
}

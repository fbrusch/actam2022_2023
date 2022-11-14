/**  @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");

var canvas_context = canvas.getContext("2d");

/**/
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
/**/

let waveform = new Tone.Waveform();

let mic = new Tone.UserMedia();


document.onclick = () => 

{
    //c.resume();
    //navigator.mediaDevices.getUserMedia({audio:true}).then(connectStream);
    //draw();
    Tone.start();
    mic.open().then(() => {
        // promise resolves when input is available
        console.log("mic open");
        mic.output.chain(waveform, Tone.Destination)
        draw();
    }).catch(e => {
        // promise is rejected when the user doesn't have or allow mic access
        console.log("mic not open");
    });
}

/**/
a.fftSize = 2048;
const bufferLenght = a.frequencyBinCount;
const array = new Float32Array(bufferLenght);
/**/

let bufferArray;


function draw() {
    requestAnimationFrame(draw);
    a.getFloatTimeDomainData(array);
    canvas_context.clearRect(0,0,canvas.width, canvas.height);
    canvas_context.beginPath();
    canvas_context.moveTo(0,0);


    bufferArray = waveform.getValue(0);

    for(let i = 0; i < bufferArray.length; i++) {
        canvas_context.lineTo(i,bufferArray[i]*canvas.height/2 + canvas.height/2);
    }

    canvas_context.stroke()
}

function  connectStream(stream) {
    var streamDevice = c.createMediaStreamSource(stream);
    streamDevice.connect(a);
}




/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const canvas_context = canvas.getContext("2d");


let waveform = new Tone.Waveform();
let mic = new Tone.UserMedia();


document.onclick = () =>
{

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



let bufferArray;


function draw() {
    requestAnimationFrame(draw);

    canvas_context.clearRect(0,0,canvas.width, canvas.height);
    canvas_context.beginPath();
    canvas_context.moveTo(0,0);

    bufferArray = waveform.getValue(0);
    for(let i = 0; i < bufferArray.length; i++) {
        canvas_context.lineTo(i,bufferArray[i]*canvas.height/2 + canvas.height/2);
    }

    canvas_context.stroke()
}





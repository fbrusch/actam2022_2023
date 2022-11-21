let ready = false;
let masterVolume = -9; // in decibels (dB);
Tone.Destination.volume.value = masterVolume;

let scale;
let synth = new Tone.Synth().toDestination();
let prevNote;



function setup() {
    createCanvas(windowWidth, windowHeight);
    scale = Tonal.Scale.get("C4 minor").notes;
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);

    if (ready) {

        let noteNumber = floor(map(mouseX, 0, width, -14, 21));
        console.log('noteNumber', noteNumber);
        let note = mapNote(noteNumber, scale);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(100);
        text(note, width / 2, height / 2);

        // play the note
        if (note !== prevNote) {
            synth.triggerAttackRelease(note, "8n");
            prevNote = note;
        }
    } else {
        fill(255);
        textAlign(CENTER, CENTER);
        text("CLICK TO START", width / 2, height / 2);
    }
}

//------------------------------------------------------------
function mapNote(noteNumber, scale) {
    let numNotes = scale.length;
    let i = modulo(noteNumber, numNotes);
    let note = scale[i];
    let octaveTranspose = floor(noteNumber / numNotes);
    let interval = Tonal.Interval.fromSemitones(octaveTranspose*12);
    return Tonal.Note.transpose(note, interval);
}

//------------------------------------------------------------
function modulo(n, m) {
    return ((n % m) + m) % m;
}

//------------------------------------------------------------
function mousePressed() {
    Tone.start().then( result =>{
        ready= true;
    })
}

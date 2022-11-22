import * as Tonal from 'tonal';
import * as Tone from 'tone';

let ready = false;
let masterVolume = -9; // in decibels (dB);
Tone.Destination.volume.value = masterVolume;

let scale;
let synth = new Tone.Synth().toDestination();
let prevNote;
let myp5;

let p5i = function(p5c){

    p5c.mousePressed = function() {
        Tone.start().then( result =>{
            ready= true;
        })
    }

    p5c.setup = function() {
        p5c.createCanvas(p5c.windowWidth, p5c.windowHeight);
        scale = Tonal.Scale.get("C4 minor").notes;
    }

    p5c.windowResized = function() {
        p5c.resizeCanvas(p5c.windowWidth, p5c.windowHeight);
    }

    p5c.draw = function() {
        p5c.background(0);

        if (ready) {

            let noteNumber = p5c.floor(p5c.map(p5c.mouseX, 0, p5c.width, -14, 21));
            console.log('noteNumber', noteNumber);
            let note = mapNote(noteNumber, scale);

            p5c.fill(255);
            p5c.textAlign(p5c.CENTER, p5c.CENTER);
            p5c.textSize(100);
            p5c.text(note, p5c.width / 2, p5c.height / 2);

            // play the note
            if (note !== prevNote) {
                synth.triggerAttackRelease(note, "8n");
                prevNote = note;
            }
        } else {
            p5c.fill(255);
            p5c.textAlign(p5c.CENTER, p5c.CENTER);
            p5c.text("CLICK TO START", p5c.width / 2, p5c.height / 2);
        }
    }

}


myp5 = new p5(p5i);


//------------------------------------------------------------
function mapNote(noteNumber, scale) {
    let numNotes = scale.length;
    let i = modulo(noteNumber, numNotes);
    let note = scale[i];
    let octaveTranspose = Math.floor(noteNumber / numNotes);
    let interval = Tonal.Interval.fromSemitones(octaveTranspose*12);
    return Tonal.Note.transpose(note, interval);
}

//------------------------------------------------------------
function modulo(n, m) {
    return ((n % m) + m) % m;
}

//------------------------------------------------------------

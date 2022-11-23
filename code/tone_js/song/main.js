//We are going to use parcel js to use the ES6 syntax
import * as Tone from 'tone';
import * as Tonal from 'tonal';

/*
//if you prefer to debug, you may want to use browserify instead
Tone = require('tone');
Tonal = require('tonal');
*/

/*----------GLOBAL ------------*/
Tone.Destination.volume.value = -9; // this value is in dB
let main_bpm = 120;
let main_loop_interval = "1m";
let scaleNotes = Tonal.Scale.get("C4 major").notes;



/*----------HELPER FUNCTIONS-------------*/
let modulo = function(n, m) {
    return ((n % m) + m) % m;
}

let getMidiNote = function(noteNumber, notes) {
    let numNotes = notes.length;
    let i = modulo(noteNumber, numNotes);
    let note = notes[i];
    let octaveTranspose = Math.floor(noteNumber / numNotes);
    let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
    return Tonal.Note.transpose(note, interval);
}


/*----------BASE CHORDS ------------*/
let chords = [];
let numOfChords = 4;
let poly = new Tone.PolySynth(Tone.AMSynth);
poly.toDestination();
let setupChords = function() {
    for (let i = 0; i < numOfChords; i++) {
        let chord = [];

        chord[0] = getMidiNote(i, scaleNotes);
        chord[1] = getMidiNote(i + 2, scaleNotes);
        chord[2] = getMidiNote(i + 4, scaleNotes);
        chord[3] = getMidiNote(i + 6, scaleNotes);

        //console.log(chord);
        chords.push(chord);
    }
}
let chord_generator = function* () {
    let chord_index = 0;
    while (true) {
        yield chords[chord_index++ % chords.length];
    }
}
setupChords();
const main_chord_generator = chord_generator();

let main_loop_callback = function(transportTime){
    poly.triggerAttackRelease(main_chord_generator.next().value, main_loop_interval, transportTime);
}

let main_loop = new Tone.Loop(main_loop_callback, main_loop_interval);


/* Implicit functions:
* let main_loop = new Tone.Loop(transportTime => {
    changeChord(transportTime);
}, main_loop_interval);
* */


/*----------MELODY 1-------------*/
let melody_1 = new Tone.Synth();
melody_1.toDestination();
let melody1_note_interval = '8n';
let melody1_motif = 'x-xx-x--'
let melody1_notes = '4-44-546'

let melody1_metro_generator = function* (){
    let dummy_counter = 0;
    while (true) {
        yield dummy_counter++ % parseInt(melody1_note_interval[0]);
    }
}

const main_melody_generator = melody1_metro_generator();

let melody_loop_callback = function(transportTime){
    let inner_tempo = main_melody_generator.next().value
    console.log(inner_tempo);
    let curr_melody_note_index = melody1_notes[inner_tempo];
    let curr_melody_note = scaleNotes[curr_melody_note_index];
    melody_1.triggerAttackRelease(curr_melody_note,melody1_note_interval);
}

let melody_loop = new Tone.Loop(melody_loop_callback, melody1_note_interval);


/*----------PERCUSSION 1-------------*/
let percussion_1 = new Tone.MembraneSynth();
percussion_1.toDestination();
let perc1_note_interval = '4n';
let perc1_motif = 'x-xx'
let perc1_notes = '7-15'



document.getElementById("setupButton").onclick = function() {
    Tone.start().then(()=>{
        Tone.Transport.bpm.value = main_bpm;
        Tone.Transport.start();
        console.log("Tone started :)");
        main_loop.start();
        melody_loop.start("+"+numOfChords+"m");
    });
}

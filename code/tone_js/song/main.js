/*----------GLOBAL ------------*/
Tone.Master.volume.value = -9;
let main_bpm = 180;
let main_loop_interval = "1m";
let scaleNotes = Tonal.Scale.get("B4 phrygian").notes;


/*----------HELPER FUNCTIONS-------------*/
modulo = function(n, m) {
    return ((n % m) + m) % m;
}
getMidiNote = function(noteNumber, notes) {
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
setupChords = function() {
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
chord_generator = function* () {
    let chord_index = 0;
    while (true) {
        yield chords[chord_index++ % chords.length];
    }
}
setupChords();
const main_chord_generator = chord_generator();
changeChord = function(transport_time) {
    poly.triggerAttackRelease(main_chord_generator.next().value, main_loop_interval, transport_time);
}
main_loop_callback = function(transportTime){
    changeChord(transportTime);
}
let main_loop = new Tone.Loop(main_loop_callback, main_loop_interval);

/*----------MELODY 1-------------*/
let melody_1 = new Tone.Synth();
melody_1.toDestination();
let melody1_note_interval = '8n';
let melody1_motif = 'x-xx-x--'
let melody1_notes = '3-33-541'
melody1_metro_generator = function* (){
    let dummy_counter = 0;
    while (true) {
        yield dummy_counter++ % parseInt(melody1_note_interval[0]);
    }
}
const main_melody_generator = melody1_metro_generator();
melody_loop_callback = function(transportTime){
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











setupTone = async function () {
    await Tone.start();
    Tone.Transport.bpm.value = main_bpm;
    await Tone.Transport.start();
    console.log("Tone started :)");
    main_loop.start();
    melody_loop.start("+"+numOfChords+"m");
}


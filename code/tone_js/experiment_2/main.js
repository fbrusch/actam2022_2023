const Tone = require('tone');

let synth = new Tone.Synth();
synth.toDestination();

document.onclick = function () {
    Tone.start().then(runApp);
};

function runApp(){
    synth.triggerAttackRelease("C4","4n");
}


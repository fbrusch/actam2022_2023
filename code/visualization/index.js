

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// we move drawing into a function, and define a "state" of the rectangle

var x = 0;
var y = 0;
var w = 150;
var h = 150;

function render() {
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.rect(x,y,w,h);
    context.stroke();
}

render();
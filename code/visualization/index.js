

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// now let's draw a rectangle

context.moveTo(250, 200);
context.beginPath();
context.rect(20,20,150,150);
context.stroke();
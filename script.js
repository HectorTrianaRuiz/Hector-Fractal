/*global document*/
/*eslint no-unused-vars:"off"*/
/*eslint no-undef:"off"*/

var xMin = -2;
var xMax = 2;
var yMin = -2;
var yMax = 2;
var pixelSize = 0;
var myCanvas;
var ctx;
var maxIter = 70;
var newBox = [];
var isBusy = false;

function setUp() {
    myCanvas = document.getElementById("myCanvas");
    myCanvas.addEventListener("mousedown", clickDown);
    myCanvas.addEventListener("mouseup", clickUp);
    ctx = myCanvas.getContext("2d");
}

function compute() {
    isBusy = true;
    pixelSize = (xMax - xMin) / myCanvas.width;
    var x = xMin;
    var y = yMin;
    for (var i = 0; i < myCanvas.width; i++) {
        x += pixelSize;
        for (var j = 0; j < myCanvas.height; j++) {
            y = yMax - (pixelSize * j);
            var value = computePoint(x, y);
            ctx.fillStyle = "rgb(" + value / maxIter * 253 + ", 40 , 100)";
            ctx.fillRect(i, j, 1, 1);
        }
    }
    isBusy = false;
}

function computePoint(cReal, cImag) {
    var zReal = cReal;
    var zImag = cImag;
    var realTemp = 0;
    var imagTemp = 0;
    for (var n = 0; n < maxIter; n++) {
        realTemp = (zReal * zReal) - (zImag * zImag) + cReal;
        imagTemp = (2.0 * zReal * zImag) + cImag;
        zReal = realTemp;
        zImag = imagTemp;
        //console.log(zReal, zImag);
        if (Math.abs(zReal) > 1000000) {
            return n;
        }
    }
    return n;
}

function clickDown(event) {
    if (isBusy) {
        return;
    }
    var x = event.clientX - myCanvas.getBoundingClientRect().left;
    var y = event.clientY - myCanvas.getBoundingClientRect().top;
    newBox[0] = xMin + (x / myCanvas.width) * (xMax - xMin);
    newBox[1] = yMax - (y / myCanvas.width) * (yMax - yMin);

}

function clickUp(event) {
    if (isBusy) {
        return;
    }
    var x = event.clientX - myCanvas.getBoundingClientRect().left;
    var y = event.clientY - myCanvas.getBoundingClientRect().top;
    newBox[2] = xMin + (x / myCanvas.width) * (xMax - xMin);
    newBox[3] = yMax - (y / myCanvas.width) * (yMax - yMin);

    recalcRect();
}

function recalcRect() {
    var deltaX = Math.abs(newBox[2] - newBox[0]);
    var deltaY = Math.abs(newBox[3] - newBox[1]);

    if (deltaX > deltaY) {
        // fat
        xMin = Math.min(newBox[0], newBox[2]);
        xMax = Math.max(newBox[0], newBox[2]);
        var yAverage = (newBox[3] + newBox[1]) / 2;
        yMin = yAverage - (deltaX / 2);
        yMax = yAverage + (deltaX / 2);
    } else {
        //tall 
        yMin = Math.min(newBox[3], newBox[1]);
        yMax = Math.max(newBox[3], newBox[1]);
        var xAverage = (newBox[2] + newBox[0]) / 2;
        xMin = xAverage - (deltaY / 2);
        xMax = xAverage + (deltaY / 2);

    }
    compute();
}

function Reset() {
    xMin = -2;
    xMax = 2;
    yMin = -2;
    yMax = 2;

    compute();
}

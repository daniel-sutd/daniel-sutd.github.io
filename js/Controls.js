resetSlider = function() {
    //document.getElementById('pSlider').value = 100 * trace.getCurrentTime() / (trace.maxTime - trace.minTime);
    
    document.getElementById('pSlider').value = 67;
    document.getElementById('alphaSlider').value = 10;
    document.getElementById('betaSlider').value = 10;
    document.getElementById('nSlider').value = 10;
    document.getElementById('typeSlider').value = 0;
}

redrawDisplay = function() {
    var p = (document.getElementById('pSlider').valueAsNumber / 100);
    var alpha = (Math.pow(0.1, (100 - document.getElementById('alphaSlider').valueAsNumber) / 10-3));
    var beta = (Math.pow(0.1, (100 - document.getElementById('betaSlider').valueAsNumber) / 10-3));
    var n = (Math.ceil(Math.pow(10, document.getElementById('nSlider').valueAsNumber/16)));
    var type = (document.getElementById('typeSlider').valueAsNumber);
    matrixDisplay.redraw(type, alpha, beta, p, n);
    sliderDisplay.redraw(type, alpha, beta, p, n);
}

document.getElementById('pSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('alphaSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('betaSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('nSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('typeSlider').addEventListener("input", redrawDisplay, false);

matrixDisplay = new MatrixDisplay();
sliderDisplay = new SliderDisplay();
resetSlider();
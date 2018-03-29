initSlider = function() {
    //document.getElementById('pSlider').value = 100 * trace.getCurrentTime() / (trace.maxTime - trace.minTime);
    
    document.getElementById('fSlider').value = 34;
    document.getElementById('alphaSlider').value = 100 - 10*(3 + Math.log(0.01)/Math.log(0.1));
    document.getElementById('betaSlider').value = 100 - 10*(3 + Math.log(0.0001)/Math.log(0.1));
    document.getElementById('nSlider').value = 20*Math.log(100)/Math.log(10);
    document.getElementById('DSlider').value = 12*Math.log(14999.5)/Math.log(10);
    document.getElementById('typeSlider').value = 0;
    //console.log((Math.log(0.0001)/Math.log(0.1)+3)*10);
    //console.log(100 - 10*(3 + Math.log(0.0001)/Math.log(0.1)));
}

redrawDisplay = function() {
    var f = (document.getElementById('fSlider').valueAsNumber / 200)+0.5;
    var alpha = (Math.pow(0.1, (100 - document.getElementById('alphaSlider').valueAsNumber) / 10-3));
    var beta = (Math.pow(0.1, (100 - document.getElementById('betaSlider').valueAsNumber) / 10-3));
    var n = (Math.ceil(Math.pow(10, document.getElementById('nSlider').valueAsNumber/20)));
    var D = (Math.ceil(Math.pow(10, document.getElementById('DSlider').valueAsNumber/12)));
    var type = (document.getElementById('typeSlider').valueAsNumber);
    ResultDisplay.redraw(type, alpha, beta, f, n, D);
    sliderDisplay.redraw(type, alpha, beta, f, n, D);
}

document.getElementById('fSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('alphaSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('betaSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('nSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('DSlider').addEventListener("input", redrawDisplay, false);
document.getElementById('typeSlider').addEventListener("input", redrawDisplay, false);

ResultDisplay = new ResultDisplay();
sliderDisplay = new SliderDisplay();
initSlider();
redrawDisplay();
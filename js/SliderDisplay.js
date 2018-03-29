class SliderDisplay {
    
    constructor() {
        
    }
    
    redraw(type, alpha, beta, p, n) {
        var canvas = document.getElementById('sliderCanvas');
        var context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        context.fillText("type: "+SliderDisplay.TYPES[type], 6, SliderDisplay.BASE_Y+12);
        context.fillText("alpha: "+ alpha,6,SliderDisplay.BASE_Y+42);
        context.fillText("beta: "+beta,6,SliderDisplay.BASE_Y+72);
        context.fillText("f: "+p,6,SliderDisplay.BASE_Y+102);
        context.fillText("n: "+n,6,SliderDisplay.BASE_Y+132);
        /*context.fillText("node "+this.node.index,6,16);
        context.fillText("pos: ["+this.node.x+", "+this.node.y+"]",6,34);
        context.fillText("pp: "+this.node.pp,6,52);
        context.fillText("mem: "+this.node.mem,6,70);
        if(this.node.dns == "1") context.fillText("dns: yes",6,88);
        else context.fillText("dns: no",6,88);
        context.fillText("outgoing: "+this.node.outgoingConnections,6,106);
        context.fillText("bc length: "+this.node.blockchain.length,6,124);
        context.fillText("#mined: "+this.node.getNumBlocksMined()+"/"+this.node.blockchain.length,6,142);
        context.fillText("#orphans: "+this.node.orphans.length,6,160);*/
    }
}

SliderDisplay.TYPES = ["uniform", "pareto4log5", "pareto4log5rev"];

SliderDisplay.BASE_Y = 310;
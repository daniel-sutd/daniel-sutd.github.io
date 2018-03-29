class SliderDisplay {
    
    constructor() {
        
    }
    
    redraw(type, alpha, beta, p, n, D) {
        var canvas = document.getElementById('sliderCanvas');
        var context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        
        context.fillText("alpha: "+ alpha,6,SliderDisplay.BASE_Y+15);
        context.fillText("beta: "+beta,6,SliderDisplay.BASE_Y+45);
        context.fillText("f: "+p,6,SliderDisplay.BASE_Y+75);
        context.fillText("D: "+D,6,SliderDisplay.BASE_Y+105);
        context.fillText("n: "+n+" ("+SliderDisplay.timeAtEpoch(n)+")",6,SliderDisplay.BASE_Y+135);
        
        context.fillText("type: "+SliderDisplay.TYPES[type], 6, SliderDisplay.BASE_Y+175);
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

SliderDisplay.BASE_Y = 354;

SliderDisplay.timeAtEpoch = function (epoch) {
    var seconds = Math.floor(700 * epoch); // 50 blocks * 14 seconds/block
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var years = Math.floor(days / 365);
    if(years >= 1) return years+" years, "+(days-years*365)+" days";
    if(weeks >= 1) return weeks+" weeks, "+(days - 7*weeks)+" days";
    if(days >= 1) return days+" days, "+(hours - 24*days)+" hours";
    if(hours >= 1)  return hours+" hours, "+(minutes - 60*hours)+" minutes";
    if(minutes >= 1)  return minutes+" minutes, "+(seconds - 60*minutes)+" seconds";
    return seconds+" seconds";
}
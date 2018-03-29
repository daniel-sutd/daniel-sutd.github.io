class MatrixDisplay {
    
    constructor() {
        
    }
    
    getDepositChange(casper, idx) {
        return (casper.getScaledDeposit(idx)/Casper.INITIAL_SCALE_FACTOR - casper.validatorInitDeposits[idx])/casper.validatorInitDeposits[idx];
    }
    
    redraw(type, alpha, beta, p, n) {
        var BASE_DEPOSIT = 15000;
        var canvas = document.getElementById('matrixCanvas');
        var context = canvas.getContext('2d');
        
        var casperMC = new Casper(100, BASE_DEPOSIT * Casper.INITIAL_SCALE_FACTOR, type, p, alpha, beta);
        casperMC.processEpochs(n);
        var casperSF = new Casper(100, BASE_DEPOSIT * Casper.INITIAL_SCALE_FACTOR, type, 1-p, alpha, beta);
        casperSF.reverseDeposits();
        casperSF.processEpochs(n);
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        
        context.fillText("MC",186,26);
        context.fillText("SF",456,26);
        context.fillText("MC",26,96);
        context.fillText("SF",26,186);
        
        
        context.fillText(this.getDepositChange(casperMC, casperMC.numValidators-1),96,96);
        context.fillText(this.getDepositChange(casperMC, 0),96,126);
        
        context.fillText(this.getDepositChange(casperSF, 0),96,186);
        context.fillText(this.getDepositChange(casperSF, casperSF.numValidators-1),96,216);
        
        //context.fillText(casper.epoch,6,16);
        
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


class ResultDisplay {
    
    constructor() {
        
    }
    
    getDepositChange(casper, idx) {
        return (casper.getScaledDeposit(idx)/Casper.INITIAL_SCALE_FACTOR - casper.validatorInitDeposits[idx])/casper.validatorInitDeposits[idx];
    }
    
    redraw(type, alpha, beta, f, n, D) {
        var canvas = document.getElementById('ResultCanvas');
        var context = canvas.getContext('2d');
        
        var casperMC = new Casper(Casper.BASE_NUM_VALIDATORS, D * Casper.INITIAL_SCALE_FACTOR, type, f, alpha, beta);
        casperMC.processEpochs(n);
        var casperSF = new Casper(Casper.BASE_NUM_VALIDATORS, D * Casper.INITIAL_SCALE_FACTOR, type, 1-f, alpha, beta);
        casperSF.reverseDeposits(); // only needed for now disabled Pareto distribution of deposits
        casperSF.processEpochs(n);
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        
        // top
        context.fillText("Relative change in deposit sizes after n epochs", 40, 25);
        context.beginPath();
        context.moveTo(18,36);
        context.lineTo(400,36);
        context.stroke();
        
        // actual content
        context.fillText("Main Chain",16,ResultDisplay.BASE_Y-4);
        context.fillText("wins",42,ResultDisplay.BASE_Y+14);
        
        context.fillText("Majority:",116,ResultDisplay.BASE_Y-8);
        context.fillText("Minority:",116,ResultDisplay.BASE_Y+16);
        
        context.fillText("Minority Fork",12,ResultDisplay.BASE_Y+86);
        context.fillText("wins",40,ResultDisplay.BASE_Y+104);
        
        context.fillText("Majority:",116,ResultDisplay.BASE_Y+82);
        context.fillText("Minority:",116,ResultDisplay.BASE_Y+106);
        
        context.fillText(this.getDepositChange(casperMC, casperMC.numValidators-1),186,ResultDisplay.BASE_Y-8);
        context.fillText(this.getDepositChange(casperMC, 0),186,ResultDisplay.BASE_Y+16);
        context.fillText("Finalization epoch: "+casperMC.getFinalizationEpoch(), 180,ResultDisplay.BASE_Y+40);
        
        context.fillText(this.getDepositChange(casperSF, 0),186,ResultDisplay.BASE_Y+82);
        context.fillText(this.getDepositChange(casperSF, casperSF.numValidators-1),186,ResultDisplay.BASE_Y+106);
        context.fillText("Finalization epoch: "+casperSF.getFinalizationEpoch(), 180,ResultDisplay.BASE_Y+130);
        
        // botom
        context.beginPath();
        context.moveTo(18,ResultDisplay.BASE_Y+144);
        context.lineTo(400,ResultDisplay.BASE_Y+144);
        context.stroke();
        
        context.fillText("Interpretation:", 20, ResultDisplay.BASE_Y+164);
        context.fillText("alpha: base interest factor", 24, ResultDisplay.BASE_Y+182);
        context.fillText("beta: base penalty factor", 24, ResultDisplay.BASE_Y+200);
        context.fillText("every epoch, the first f validators vote, others do not", 24, ResultDisplay.BASE_Y+218);
        context.fillText("currently, only 'type' is uniform distribution of deposits:", 24, ResultDisplay.BASE_Y+236);
        context.fillText(" i.e., 100 validators, each with initial deposit of size D", 24, ResultDisplay.BASE_Y+254);
        context.fillText("Pareto distriution is also in Casper.js, but disabled", 24, ResultDisplay.BASE_Y+272);
    }
}

ResultDisplay.BASE_Y = 68;

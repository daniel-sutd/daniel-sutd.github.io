class ResultDisplay {
    
    constructor() {
        
    }
    
    redraw(type, alpha, beta, f, n, D) {
        var canvas = document.getElementById('ResultCanvas');
        var context = canvas.getContext('2d');
        
        var casperMC = new Casper(Casper.BASE_NUM_VALIDATORS, D, type, f, alpha, beta);
        casperMC.processEpochs(n);
        var casperSF = new Casper(Casper.BASE_NUM_VALIDATORS, D, type, 1-f, alpha, beta);
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
        
        context.fillText(casperMC.getDepositChange(casperMC.numValidators-1),186,ResultDisplay.BASE_Y-8);
        context.fillText(casperMC.getDepositChange(0),186,ResultDisplay.BASE_Y+16);
        context.fillText("Finalization epoch: "+casperMC.getFinalizationEpoch(), 180,ResultDisplay.BASE_Y+40);
        
        context.fillText(casperSF.getDepositChange(0),186,ResultDisplay.BASE_Y+82);
        context.fillText(casperSF.getDepositChange(casperSF.numValidators-1),186,ResultDisplay.BASE_Y+106);
        context.fillText("Finalization epoch: "+casperSF.getFinalizationEpoch(), 180,ResultDisplay.BASE_Y+130);
        
        // yearly interest
        context.beginPath();
        context.moveTo(18,ResultDisplay.BASE_Y+144);
        context.lineTo(400,ResultDisplay.BASE_Y+144);
        context.stroke();
        
        var numEpochsInYear = (365.25 * 24 * 3600) / SliderDisplay.SECONDS_PER_EPOCH;
        var estimatedInterest = Math.pow(1 + casperMC.getDepositChange(casperMC.numValidators-1), numEpochsInYear/(n-1));
        
        context.fillText("Estimates based on majority voter on main chain: ", 24, ResultDisplay.BASE_Y+162);
        context.fillText("yearly interest: "+((estimatedInterest)-1)*100+"%", 30, ResultDisplay.BASE_Y+180);
        context.fillText("deposit scale factor (epoch n): "+casperMC.depositScaleFactor, 30, ResultDisplay.BASE_Y+198);
        
         // explanation
        context.beginPath();
        context.moveTo(18,ResultDisplay.BASE_Y+204);
        context.lineTo(400,ResultDisplay.BASE_Y+204);
        context.stroke();
        
        context.fillText("Interpretation:", 20, ResultDisplay.EXPLANATION_Y+164);
        context.fillText("alpha: base interest factor", 24, ResultDisplay.EXPLANATION_Y+182);
        context.fillText("beta: base penalty factor", 24, ResultDisplay.EXPLANATION_Y+200);
        context.fillText("every epoch, the last f validators vote, others do not", 24, ResultDisplay.EXPLANATION_Y+218);
        context.fillText("currently, only 'type' is uniform distribution of deposits:", 24, ResultDisplay.EXPLANATION_Y+236);
        context.fillText(" i.e., 100 validators, each with initial deposit of size D", 24, ResultDisplay.EXPLANATION_Y+254);
        context.fillText("Pareto distriution is also in Casper.js, but disabled", 24, ResultDisplay.EXPLANATION_Y+272);
    }
}

ResultDisplay.BASE_Y = 68;
ResultDisplay.EXPLANATION_Y = 124;

class Casper {
	constructor(numValidators, D, setting, f, baseInterestFactor, basePenaltyFactor) {
        this.validatorInitDeposits = [];
        this.validatorPrevDeposits = [];
        this.validatorDeposits = [];
        this.validatorVoteProbs = [];
        this.numValidators = numValidators;

        this.baseInterestFactor = baseInterestFactor;
        this.basePenaltyFactor = basePenaltyFactor;

        this.rewardFactor = this.baseInterestFactor/Math.sqrt(D*numValidators); 
        this.depositScaleFactor = Casper.INITIAL_SCALE_FACTOR;
        // the initial value has some impact during the first epoch because it impacts the deposit factor rescale:
        this.prevDepositScaleFactor = this.depositScaleFactor;

        this.totalVoteUnscaled = 0;
        this.epoch = 0;
        this.lastJustifiedEpoch = 0;
        this.lastFinalizedEpoch = -1;
        this.finalizationEpoch = 0;
        
        this.D = D;
        this.f = f;
        this.setting = setting;
        
        this.initFraction(D, f, setting);
        this.initDeposits(D, setting);
	}
	
	initFraction(D, f, setting) {
		this.initDeposits(D, setting);
		this.initFractionVote(f);
	}
	
	initProb(D, f, setting) {
		this.initDeposits(D, setting);
		this.initBernoulliProbVote(f);
	}
	
	initDeposits(D, setting) {
		if(setting == Casper.UNIFORM) {
			this.initUniform(D);
		} else if(setting == Casper.PARETO4LOG5) {
			this.initPareto(D, Math.log(5)/Math.log(4), false);
		} else if(setting == Casper.PARETO4LOG5REV) {
			this.initPareto(D, Math.log(5)/Math.log(4), true);
		}
	}
	
	initUniform(D) {
		for(var i=0; i<this.numValidators; i++) {
			this.validatorDeposits[i] = D / Casper.INITIAL_SCALE_FACTOR;
			this.validatorPrevDeposits[i] = this.validatorDeposits[i];
            this.validatorInitDeposits[i] = this.validatorDeposits[i];
		}
	}
	
	initPareto(minDeposit, alpha, reversed) {
		var revStore = [];
		for(var i=0; i<this.numValidators; i++) {
			this.validatorDeposits[i] = minDeposit/Math.pow(i+1, alpha);
		}
		var smallest = this.validatorDeposits[this.validatorDeposits.length-1];
		for(i=0; i<this.numValidators; i++) {
			this.validatorDeposits[i] *= minDeposit / smallest / this.depositScaleFactor;
			this.validatorPrevDeposits[i] = this.validatorDeposits[i] * this.depositScaleFactor;
			revStore[i] = this.validatorDeposits[i];
            this.validatorInitDeposits[i] = this.validatorDeposits[i];
		}
		
		if(reversed) {
			for(i=0; i<this.numValidators; i++) {
				this.validatorDeposits[i] = revStore[this.numValidators-1-i];
                this.validatorInitDeposits[i] = this.validatorDeposits[i];
			}
		}
	}
	
	initFractionVote(f) {
		for(var i=0; i<this.numValidators; i++) {
			if(i < (1-f)*this.numValidators) this.validatorVoteProbs[i] = 0;
			else this.validatorVoteProbs[i] = 1;
		}
	}
	
	initBernoulliProbVote(f) {
		for(var i=0; i<this.numValidators; i++) {
			this.validatorVoteProbs[i] = f;
		}
	}
    
    reverseDeposits() {
        var revs = [];
        var revInits = [];
        for(var i=0; i<this.numValidators; i++) {
			revs[i] = this.validatorDeposits[this.numValidators-1-i];
            revInits[i] = this.validatorDeposits[this.numValidators-1-i];
		}
        for(i=0; i<this.numValidators; i++) {
			this.validatorDeposits[i] = revs[i];
            this.validatorInitDeposits[i] = revInits[i];
		}
    }
	
	getTotalDepositsUnscaled() {
		var result = 0;
		for(var i=0;i<this.numValidators;i++) {
			result += this.validatorDeposits[i];
		}
		return result;
	}
    
    getESF() {
        return this.epoch - this.lastFinalizedEpoch;
    }
    
    getCollectiveReward() {
        // relevant for the first epoch, we are assuming the fork in something close to steady-state
        if(this.epoch == 1) return this.rewardFactor/2;
        var votePercentage = this.totalVoteUnscaled/this.getTotalDepositsUnscaled();
		if(this.getESF() > 2) votePercentage = 0;
        return votePercentage*this.rewardFactor/2;
    }
    
    getScaledDeposit(i) {
        return this.validatorPrevDeposits[i] * this.depositScaleFactor;
    }
    
    getFinalizationEpoch() {
        if(this.getESF() == 1) return this.finalizationEpoch;
        else return "not finalized";
    }
	
	processEpoch() {
		this.epoch++;
		// record deposit values for analysis purposes
		for(var i=0; i<this.numValidators; i++) {
			// include the scale factor to incorporate per-epoch changes 
			this.validatorPrevDeposits[i] = this.validatorDeposits[i];
		}
		
		// update scale factor
        this.prevDepositScaleFactor = this.depositScaleFactor;
		if(this.epoch > 1) this.depositScaleFactor = this.depositScaleFactor * (1 + this.getCollectiveReward())/(1 + this.rewardFactor);
		
		// update reward factor
		this.rewardFactor = this.baseInterestFactor/Math.sqrt(this.getTotalDepositsUnscaled() * this.prevDepositScaleFactor) + this.basePenaltyFactor * (this.getESF()-2); 
		
        
		// update deposits
		this.totalVoteUnscaled = 0;
		for(var i=0; i<this.numValidators; i++) {
			if(Math.random() < this.validatorVoteProbs[i]) {
				this.validatorDeposits[i] += this.validatorDeposits[i] * this.rewardFactor;
				this.totalVoteUnscaled += this.validatorDeposits[i];
			}
            // check for justification/finalization
            if(this.totalVoteUnscaled/this.getTotalDepositsUnscaled() > 2./3 && this.lastJustifiedEpoch < this.epoch) {
                if(this.lastJustifiedEpoch == this.epoch-1) {
                    if(this.epoch - this.lastFinalizedEpoch >= 3) this.finalizationEpoch = this.epoch; // just for tracing purposes
                    this.lastFinalizedEpoch = this.epoch-1;
                }
                this.lastJustifiedEpoch = this.epoch;
            }
		}
	}
    
    getDepositChange(idx) {
        return (this.getScaledDeposit(idx)/Casper.INITIAL_SCALE_FACTOR)/this.validatorInitDeposits[idx] - 1;
    }
    
    processEpochs(n) {
        //var z = this.numValidators - 1;
        for(var i=0;i<n;i++) {
            this.processEpoch();
            //if(i<1000) console.log(i+" "+this.rewardFactor+" "+this.validatorDeposits[z]+" "+this.getScaledDeposit(z));
            //console.log((i+1./3)+" "+this.depositScaleFactor+" "+this.validatorDeposits[z]);
        }
    }
}

Casper.UNIFORM = 0;
Casper.PARETO4LOG5 = 1;
Casper.PARETO4LOG5REV = 2;

Casper.INITIAL_SCALE_FACTOR = 10000000000;

Casper.BASE_NUM_VALIDATORS = 100;
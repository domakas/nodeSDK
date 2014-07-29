var Area = require('../model/Area'),
    Move = require('../model/Move');

function Boxer() {
  this.attack1 = Area.NOSE;
  this.attack2 = Area.JAW;
  this.defence = Area.NOSE;

  this.myScoreTotal = 0;
  this.opponentScoreTotal = 0;
  this.comment = '';

}

Boxer.prototype.makeNextMove = function(opponentsLastMove, myLastScore, opponentsLastScore) {
  var rez = new Move();

  rez.addAttack(this.attack1)
     .addAttack(this.attack2)
     .setComment('la la la');

  if(opponentsLastMove) {
    if(opponentsLastMove.getAttacks().indexOf(this.defence) !== -1) {
      rez.setComment('blocked your move to my ' + this.defence + '... hahaha');
    } else {
      this.changeDefence();
    }
  }

  this.myScoreTotal += myLastScore;
  this.opponentScoreTotal += opponentsLastScore;

  if (this.myScoreTotal < this.opponentScoreTotal){
    rez.setComment('okay, meat, me is mad now... going berserk');
    rez.addAttack(this.createRandomAttack());
  } else {
    rez.addBlock(this.defence);
  }

  return rez;
};

Boxer.prototype.changeDefence = function() {
  if (this.defence === Area.NOSE) {
    this.defence = Area.JAW;
  }

  this.defence = Area.NOSE;
};

Boxer.prototype.createRandomAttack = function() {
  var random = Math.floor((Math.random() * 10) + 0);
  if (random >= 5) {
    return Area.GROIN;
  }
  return Area.BELLY;
};


module.exports = Boxer;
var Area = require('../model/Area'),
    Move = require('../model/Move');

function Kickboxer() {
  this.attack1 = Area.GROIN;
  this.attack2 = Area.NOSE;
  this.defence = Area.NOSE;

  this.comment = '';

}

Kickboxer.prototype.makeNextMove = function(opponentsLastMove, myLastScore, opponentsLastScore) {
  var rez = new Move();

  if (opponentsLastMove) {
    if(opponentsLastMove.getAttacks().indexOf(this.defence) !== -1) {
      this.comment = 'haha, blocked your attack to my ' + this.defence; // good!
    } else {
      this.comment= 'ouch'; // don't care - will only defend my head either way
    }
  }

  this.attack2 = this.createRandomArea();
  if (opponentsLastMove) {
    if(opponentsLastMove.getBlocks().indexOf(this.attack1) !== -1) {
      this.attack1 = this.createRandomArea();
    }
  }

  rez.addAttack(this.attack1)
      .addAttack(this.attack2)
      .addBlock(this.defence)
      .setComment(this.comment);

  return rez;
};

Kickboxer.prototype.createRandomArea = function() {
  var random = Math.floor((Math.random() * 100) + 0);

  if (random<30)
    return Area.NOSE;

  if (random<70)
    return Area.JAW;

  if (random<90)
    return Area.GROIN; // oh yeah

  return Area.LEGS;
};


module.exports = Kickboxer;
var prompt = require('sync-prompt').prompt;
var Protocol = require('./server/Protocol');
var ProtocolException = require('./ProtocolException');
var GameScoringRules = require('../model/GameScoringRules');

function Human() {

}

Human.prototype.makeNextMove = function(oppMove, iScored, oppScored) {
  this.printInstructions();

  try {
    this.input = prompt('(for example, BN BB AN): ');
  } catch(Error) {
    console.log('Human error');
  }

  return this.parseInput(this.input);

};

Human.prototype.printInstructions = function() {
  console.log('Make your move by (A)ttacking and (B)locking (N)ose, (J)aw, (B)elly, (G)roin, (L)egs');
};

Human.prototype.parseInput = function(strin) {
  var input = strin.replace(/ /g, '').toLocaleLowerCase();
  var prot = new Protocol();

  if (this.startsWith(input, 'q'))
    throw new ProtocolException('Exiting');

  var move = prot.parseMove(input);
  if (!GameScoringRules.isMoveLegal(move)) {
    throw new ProtocolException('Can make max 3 things at a time!');
  }

  return move;
};

Human.prototype.startsWith = function(haystack, needle) {
  return haystack.substring(0, 1) === needle;
};

module.exports = Human;
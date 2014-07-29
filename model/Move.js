function Move() {
  this.attacks = [];
  this.blocks = [];
  this.comment = '';
}

Move.prototype.getAttacks = function() {
  return this.attacks;
};

Move.prototype.getBlocks = function() {
  return this.blocks;
};

Move.prototype.getComment = function() {
  return this.comment;
};

Move.prototype.setComment = function(comment) {
  this.comment = comment;
  return this;
};

Move.prototype.addAttack = function(area) {
  this.attacks.push(area);
  return this;
};

Move.prototype.addBlock = function(area) {
  this.blocks.push(area);
  return this;
};

Move.prototype.toString = function() {
  var rez = 'Move ',
      i, j;

  for(i = 0; i < this.attacks.length; i++) {
    rez = rez + ' ATTACK ' + this.attacks[i];
  }

  for(j = 0; j < this.blocks.length; j++) {
    rez = rez + ' BLOCK ' + this.blocks[i];
  }

  if(this.comment !== '') {
    rez = rez + ' COMMENT ' + this.comment;
  }

  return rez;
};


module.exports = Move;
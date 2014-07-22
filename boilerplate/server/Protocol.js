var ServerResponse = require('./ServerResponse');
var ProtocolException = require('../ProtocolException');
var Area = require('../../model/Area');
var Move = require('../../model/Move');

function Protocol(inStream) {
  this.HANDSHAKE = 'I-AM ready';

  this.REQUEST_HEADER = '';

  this.YOUR_SCORE = 'YOUR-SCORE';
  this.OPPONENT_SCORE = 'OPPONENT-SCORE';
  this.ENEMY_MOVE = 'ENEMY-MOVE';
  this.MOVE_COMMENT = 'COMMENT';

  this.inStream = inStream;
}

Protocol.prototype.handshake = function() {
  console.log(this.HANDSHAKE);
};

Protocol.prototype.sendRequest = function(move) {
  console.log(this.REQUEST_HEADER + this.serializeMove(move));
};

Protocol.prototype.readResponse = function() {
  var input = this.inStream();
  return this.parse(input);
};

Protocol.prototype.serializeMove = function(move) {
  var rez = '';

  for(var i = 0; i < move.getAttacks().length; i++) {
    rez = rez + 'a' +  move.getAttacks()[i].substring(0, 1);
  }

  for(var j = 0; j < move.getBlocks().length; j++) {
    rez = rez + 'b' +  move.getBlocks()[j].substring(0, 1);
  }

  if(move.getComment()) {
    rez = rez + 'c' + this.sanitizeComment(move.getComment());
  }

  return rez.toLocaleLowerCase();
};

Protocol.prototype.parseMove = function(input) {
  if(!input) {
    throw new ProtocolException('Input stream was closed');
  }

  input = input.trim();

  var rez = new Move();
  var index = 0;

  while (index < input.length) {
    var type = input[index++];

    switch (type) {
      case 'a': rez.addAttack(this.getArea(input, index++)); break;
      case 'b': rez.addBlock(this.getArea(input, index++)); break;
      case '.':
      case 'c': rez.setComment(input.substring(index, input.length));
        index = input.length + 1;
        break;
      case ' ':
      case '\t':
        continue;
      default:
        throw new ProtocolException('Unrecognized input: ' + type);
    }
  }
  return rez;
};

Protocol.prototype.sanitizeComment = function(comment) {
  if(!comment) {
    return null;
  }

  comment = comment.replace(/\t|\n|"/g, ' ');
  comment = comment.trim();
  if(comment.length > 150) {
    comment = comment.slice(0, 150);
  }

  return comment;
};

Protocol.prototype.parse = function(line) {
  var result = new ServerResponse();

  var words = line.split(' ');
  var index = 0;

  while(index < words.length) {
    var firstKeyword = words[index++];

    if (index >= words.length) {
      throw new ProtocolException(
        'Insufficient params in {' + line +
        '}. Syntax is [YOUR-SCORE area] [OPPONENT-SCORE area] [ENEMY-MOVE move]'
      );
    }

    var nextKeyword = words[index++];

    if (this.YOUR_SCORE === firstKeyword) {
      result.score1 = parseInt(nextKeyword, 10);
    } else if(this.OPPONENT_SCORE === firstKeyword) {
      result.score2 = parseInt(nextKeyword, 10);
    } else if(this.ENEMY_MOVE === firstKeyword) {
      result.move = this.parseMove(nextKeyword);
    } else {
      throw new ProtocolException(
        'invalid keyword ' + firstKeyword +'. Syntax is [YOUR-SCORE area] [OPPONENT-SCORE area] [ENEMY-MOVE move]'  );
    }
  }

  return result;
};

Protocol.prototype.getArea = function(line, index) {
  if(index >= line.length){
    throw new ProtocolException('Must also specify attack/defence area!');
  }

  switch (line[index]) {
    case 'n':
      return Area.NOSE;
    case 'j':
      return Area.JAW;
    case 'b':
      return Area.BELLY;
    case 'g':
      return Area.GROIN;
    case 'l':
      return Area.LEGS;
    default:
      throw new ProtocolException('Unrecognized area: ' + line[index]);
  }
};

module.exports = Protocol;
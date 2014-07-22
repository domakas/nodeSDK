var prompt = require('sync-prompt').prompt;
var Protocol = require('./Protocol');
var ServerResponse = require('./ServerResponse');

function ServerMode() {
  this.inStream = prompt;
  this.outStream = console.log;
  this.cancelFlag = false;
}

ServerMode.prototype.run = function(fighter) {
  var protocol = new Protocol(this.inStream, this.outStream);
  protocol.handshake();

  var resp = new ServerResponse();

  while (!this.cancelFlag) {
    var move = fighter.makeNextMove(resp.move, resp.score1, resp.score2);
    protocol.sendRequest(move);
    resp = protocol.readResponse();
  }
};

ServerMode.prototype.setInputStream = function(istream) {
  this.inStream = istream;
};

ServerMode.prototype.setOutputStream = function(ostream) {
  this.outStream = ostream;
};
ServerMode.prototype.cancel = function(){
  this.cancelFlag = true;
};

module.exports = ServerMode;
function ProtocolException(message) {
  this.message = message;
  this.name = 'ProtocolException';
  this.code = 0;

  this.toString = function() {
    return this.name + ': [' + this.code + ']: {' + this.message + '}\n';
  };
}

module.exports = ProtocolException;
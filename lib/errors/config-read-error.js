var ConfigReadError = function(message) {
  this.name = 'ConfigReadError';
  this.message = message;
  this.stack = (new Error()).stack;
};

ConfigReadError.prototype = Object.create(Error.prototype);
ConfigReadError.prototype.constructor = ConfigReadError;

module.exports = ConfigReadError;

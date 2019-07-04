class LogicError extends Error {
  constructor(msg) {
    super();
    this.stateCode = 1;
    this.message = msg;
  }
}

module.exports = LogicError;
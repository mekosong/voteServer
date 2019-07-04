class BusinessError extends Error {
  constructor(obj) {
    super();
    this.stateCode = obj.stateCode;
    this.message = obj.message;
  }
}

module.exports = BusinessError;
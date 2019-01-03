import models from '~../db/models';

let instance = null;

const Trade = class {
  constructor() {
    if (!instance) { instance = this; }    
    return instance;
  }
  
}

module.exports = new Trade();
'use strict';

const cryptomap = require('../server/proxy/cryptomap');

describe('Jvi', () => {

  it('Jvi api', async () => {
    let info = await cryptomap.getInfo();      
    expect(info.name).toBe('crypto-map');
  });  

}); 
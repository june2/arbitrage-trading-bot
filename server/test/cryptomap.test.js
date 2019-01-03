'use strict';

const cryptomap = require('../server/proxy/cryptomap');

describe('Cryptomap', () => {

  it('Cryptomap info api', async () => {
    let info = await cryptomap.getInfo();      
    expect(info.name).toBe('crypto-map');
  });  

});
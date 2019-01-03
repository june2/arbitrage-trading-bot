'use strict';

const Binance = require('../server/proxy/exchanges/binance');

describe('Binance', () => {

  // it('Ping api', async () => {
  //   console.log(await client.ping())
  // });

  // it('Account api', async () => {
  //   let account = await client.accountInfo();
  //   console.log(account)
  // });

  it('Account api', async () => {
    let account = await Binance.getAccount('XRP');
    console.log(account);
  });

});
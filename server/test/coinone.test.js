'use strict';

const Coinone = require('../server/proxy/exchanges/coinone');

describe('Coinone', () => {

  it('Account api', async () => {    
    let account = await Coinone.getAccount('XRP');
    console.log(account);
  });

  // it('Order api', async () => {    
  //   let order = await Coinone.order('XRP', '1', '100', 'bid');
  //   console.log(order);
  // });

  // it('Order Info api', async () => {    
  //   let info = await Coinone.getOrderInfo('ab6d92d5-682d-41e8-9eef-9f3a0c0fa666', 'XRP');
  //   console.log(info);
  // });

  // it('Cancel order api', async () => {    
  //   let cancel = await Coinone.cancelOrder('61fae601-218e-4560-9af6-90853a3cdae0', '100', '1', 'XRP', 0);
  //   console.log(cancel);
  // });
});
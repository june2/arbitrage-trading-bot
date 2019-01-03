'use strict';

const Upbit = require('../server/proxy/exchanges/upbit');

describe('Upbit', () => {
  it('Account api', async () => {
    let account = await Upbit.getAccount('XRP');
    console.log(account);
  });

  // it('Order api', async () => {    
  //   let order = await Upbit.order('XRP', '10', '100', 'bid');
  //   console.log(order);
  // });

  // it('get Order info api', async () => {    
  //   let info = await Upbit.getOrderInfo();
  //   console.log(info);
  // });  

  // it('cancel Order info api', async () => {    
  //   let info = await Upbit.cancelOrder('d014deb5-194f-471a-b092-33ef011a8185');
  //   console.log(info);
  // });    
});
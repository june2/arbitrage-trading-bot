'use strict';

const Bithumb = require('../server/proxy/exchanges/bithumb');

describe('Bithumb', () => {

  it('Account balance api', async () => {
    try {
      let account = await Bithumb.getAccount('XRP');
      console.log(account);
    } catch (err) {
      console.log('err', err);
    }
  });

  // it('Order api', async () => {
  //   try {
  //     let order = await Bithumb.order('XRP', '10', '100', 'bid');
  //     console.log(order);
  //     console.log(1111);
  //   } catch (err) {
  //     console.log('err', err);
  //   }
  // });

  // it('Get Order info api', async () => {
  //   try {
  //     let info = await Bithumb.getOrderInfo('1545016821095200', 'XRP', 'bid');
  //     console.log(info);
  //   } catch (err) {
  //     console.log('err', err);
  //   }
  // });

  it('Cancel Order api', async () => {
    try {
      let info = await Bithumb.cancelOrder('1546487096001993', 'XRP', 'bid');
      console.log(info);
    } catch (err) {
      console.log('err', err);
    }
  });

});

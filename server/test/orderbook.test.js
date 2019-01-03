'use strict';

// import Mineral from '../server/components/mineral'
// import data from './orderbook.data.json'
import Event from '../server/proxy/jvi/jvi.event.js'
import data from './orderbook.data2.json'
import Coin from '~../server/components/coin';

describe('Orderbook', () => {
  // it('get result', () => {
  //   // let res = Mineral.getResult(data.KRW);
  //   // console.log(data.KRW)    
  //   // console.log('res', res);
  //   // let isValid = utils.validateReservationDate('2018/10/01 10:00:00', '2018-10-01 14:00:00')
  //   // expect(isValid).toBe(false);
  // });
  it('get result', async () => {
    await Coin.setActiveCoin();
    const time = process.hrtime();
    // for(let i=0; i<10001; i++){
    Event.handler(data);
    // console.log(Event.orderBook);
    // console.log(Event.mineral);
    // console.log(Event.mineral.KRW.ETH.orderbook);
    // }
    const diff = process.hrtime(time);
    const NS_PER_SEC = 1e9;
    console.log(`${diff[0] * NS_PER_SEC + diff[1]}`);
    setTimeout(function () { }, 20 * 1000);
  });
});

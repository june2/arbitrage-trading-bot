const Exchange = class {
  constructor() {
  }
  getAccount() {
    throw new Error('You must implement this method');
  }
  order(coin, amount, price, type, currency) {
    throw new Error('You must implement this method');
  }
  getOrderInfo(orderId, currency, ) {
    throw new Error('You must implement this method');
  }
  cancelOrder(orderId, price, qty, currency, isAsk) {
    throw new Error('You must implement this method');
  }
}

module.exports = Exchange;
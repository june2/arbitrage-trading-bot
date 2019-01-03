import { REFRESH } from '../actions/market';

const market = (state = [], action) => {
  switch (action.type) {
    case REFRESH:
      return {
        coins: action.coins,
        currencies: action.currencies
      }
    default:
      return state
  }
}

export default market
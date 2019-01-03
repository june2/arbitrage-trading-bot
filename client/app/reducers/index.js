// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import market from './market';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),    
    market
  });
}

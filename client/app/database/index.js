import Database from './database';

export const Db = {
  currencies: new Database('currencies'),
  markets: new Database('markets'),
  coins: new Database('coins')
};
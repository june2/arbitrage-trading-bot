import CryptomapService from '../../app/services/cryptomap.service';
import Database from '../../app/database';

export const REFRESH = 'REFRESH';

export const refresh = () => {
  return dispatch => {    
    CryptomapService.getInfo().then(res => {
      dispatch({
        type: REFRESH,        
        ...res
      });
    });
  };
};


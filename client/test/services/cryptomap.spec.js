
import CryptomapService from '../../app/services/cryptomap.service';

describe('CryptomapService', () => {
  describe('get version', () => {
    it('should name crypto-map', async () => {
      let res = await CryptomapService.getVersion();      
      expect(res.name).toBe('crypto-map');
    });    
  });
});

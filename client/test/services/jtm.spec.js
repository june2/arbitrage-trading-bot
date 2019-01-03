import JtmService from '../../app/services/jtm.service';

describe('JtmService', () => {
  describe('get version', () => {
    it('should name JTM', async () => {
      let res = await JtmService.getVersion();      
      expect(res.name).toBe('JTM');
    });    
  });
});

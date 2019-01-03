'use strict';

const utils = require('../server/components/utils');

describe('Room reservation date valiidation', () => {

  it('date format이 맞지 않을 경우, false', async () => {
    let isValid = utils.validateReservationDate('2018/10/01 10:00:00', '2018-10-01 14:00:00')
    expect(isValid).toBe(false);
  });  

  it('예약 시간이 30분 미만인 경우, false', async () => {
    let isValid = utils.validateReservationDate('2018-10-01 10:00', '2018-10-01 10:20')
    expect(isValid).toBe(false);
  });

  it('예약 기간이 30분 1시간 단위가 아닌경우, false', async () => {
    let isValid = utils.validateReservationDate('2018-10-01 10:00', '2018-10-01 10:50')
    expect(isValid).toBe(false);
  });

  it('예약 종료 시간이 시작시간 보다 큰경우, false', async () => {
    let isValid = utils.validateReservationDate('2018-10-01 11:30', '2018-10-01 11:00')
    expect(isValid).toBe(false);
  });

  it('validation 모두 통과시, true', async () => {
    let isValid = utils.validateReservationDate('2018-10-01 10:00', '2018-10-01 10:30')
    expect(isValid).toBe(true);
  });

});
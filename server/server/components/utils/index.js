'use strict';

import moment from 'moment';


/** 
 * @param {*} data 
 * @param {*} count 
 * count 수만큼 date 주별로 반복 생성
 */
export const generateDate = (data, count) => {
  try {
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        startAt: moment(data.startAt, 'YYYY-MM-DD HH:mm:ss').add(i * 7, 'days'),
        endAt: moment(data.endAt, 'YYYY-MM-DD HH:mm:ss').add(i * 7, 'days'),
        memo: data.memo,
        roomId: data.roomId
      });
    }
    return arr;
  } catch (err) {
    throw err;
  }
};

/** 
 * @param {*} start 
 * @param {*} end 
 * 예약 날짜 유효성 검사
 */
export const validateReservationDate = (start, end) => {
  try {
    const dateFormat = 'YYYY-MM-DD HH:mm';
    if (!moment(start, dateFormat, true).isValid()) {
      return false;
    }
    if (!moment(end, dateFormat, true).isValid()) {
      return false;
    }
    // 30min = 60*30*1000
    let diff = moment(end).valueOf() - moment(start).valueOf();
    if (diff < 0 || (diff % 1800000 !== 0)) {
      return false;
    }
    return true;
  } catch (err) {
    throw err;
  }
};

/** 
 * @param {*} date 
 * utc 시간으로 변환
 */
export const convertUtc = (date) => {
  try {
    return moment(date).utc().format('YYYY-MM-DD HH:mm');
  } catch (err) {
    throw err;
  }
};

/**
 * 
 * @param {*} obj 
 */
export const isEmptyObject = (obj) => {
  try {
    return Object.keys(obj).length === 0;
  } catch (err) {
    throw err;
  }
}

let instance = null;

const Mineral = class {
  constructor() {
    if (!instance) { instance = this; }
    return instance;
  }
  /**
   * 
   * @param {*} orderbook_by_currency 
   */
  gen_p_v_dic(orderbook_by_currency) {
    let p_v_dic = {};
    for (let coin in orderbook_by_currency) {
      p_v_dic[coin] = this.get_pv_vector_by_market(orderbook_by_currency[coin]);
    }
    return p_v_dic;
  }
  /**
   * 
   * @param {*} numbers 
   */
  median(numbers) {
    let median = 0;
    let numsLen = numbers.length;
    numbers.sort();
    if (numsLen % 2 === 0) { // is even
      median = numbers[numsLen / 2 - 1];
    } else { // is odd      
      median = numbers[(numsLen - 1) / 2];// middle number only
    }
    return median;
  }
  /**
   * 
   * @param {*} orderbook_arr 
   * @param {*} option 
   */
  calc_pv_arr(orderbook_arr, option) {
    let temp_arr;

    if (option == 'a') temp_arr = orderbook_arr.reverse();
    else temp_arr = orderbook_arr;

    let cum_vol_arr = [];
    let avg_price_arr = [];
    let price_vol_v = [];
    let pre_vol = 0;
    let pre_avg = 0;
    let curr_vol;
    let order;
    let curr_avg_price;

    for (let idx of temp_arr.keys()) {
      order = temp_arr[idx];
      curr_vol = order['amount'] * order['price'];
      curr_avg_price = (pre_avg * pre_vol + order['price'] * curr_vol) / (pre_vol + curr_vol);

      pre_vol = pre_vol + order['price'] * order['amount'];
      pre_avg = curr_avg_price;

      cum_vol_arr[idx] = pre_vol;
      avg_price_arr[idx] = pre_avg;
      price_vol_v[idx] = [pre_vol, pre_avg];
    }
    return price_vol_v;
  }
  /**
   * 
   * @param {*} ab_data_by_coin 
   */
  get_pv_vector_by_market(ab_data_by_coin) {
    let res1 = {};
    let res2 = {};
    for (let market in ab_data_by_coin) {
      let temp = ab_data_by_coin[market]
      let a_side_order = temp.slice(0, 10);
      let b_side_order = temp.slice(10, temp.length);
      res1[market] = this.calc_pv_arr(a_side_order, 'a');
      res2[market] = this.calc_pv_arr(b_side_order, 'b');
    }

    return { 'ask': res1, 'bid': res2 }
  }
  /**
   * calculate execution price at target amount
   * error code description
   * -999/-99: not enough money(actually same meaning)
   * 0 : maybe input error
   * @param {*} p_v_dic 
   */
  calc_exec_pri(p_v_vec, target_amount) {
    let exec_pri;
    if (target_amount > p_v_vec[9][0]) return -999;
    if (target_amount < p_v_vec[0][0]) return p_v_vec[0][1];
    for (let i = 0; i < 10; i++) {
      if (i == 9) return -99;
      if (target_amount < p_v_vec[i + 1][0]) {
        exec_pri = p_v_vec[i][1] + (p_v_vec[i + 1][1] - p_v_vec[i][1]) *
          ((target_amount - p_v_vec[i][0]) / (p_v_vec[i + 1][0] - p_v_vec[i][0]));
        return exec_pri;
      }
    }
    return 0;
  }
  /**
   * 
   * @param {*} p_v_dic 
   * @param {*} target_amount 
   */
  get_exec_pri_by_amount(p_v_dic, target_amount) {
    let exec_pri_dic = {};
    for (var coin in p_v_dic) {
      let coin_a_b_dic = {};
      for (let side in p_v_dic[coin]) {
        let coin_list = {};
        for (let market in p_v_dic[coin][side]) {
          coin_list[market] = this.calc_exec_pri(p_v_dic[coin][side][market], target_amount);
        }
        coin_a_b_dic[side] = coin_list;
      }
      exec_pri_dic[coin] = coin_a_b_dic;
    }
    return exec_pri_dic
  }
  /**
   * side_option = 'bid'/'ask' 
   * @param {*} exec_pri_arr 
   * @param {*} side_option 
   */
  get_median(exec_pri_arr, side_option) {
    let coin_median_dic = {};
    for (let coin in exec_pri_arr) {
      let price_arr = [];
      for (let market in exec_pri_arr[coin][side_option]) {
        if (exec_pri_arr[coin][side_option][market] == -999) continue;
        else price_arr.push(exec_pri_arr[coin][side_option][market]);
      }
      if (price_arr.length == 0) coin_median_dic[coin] = -999;
      else coin_median_dic[coin] = this.median(price_arr);
    }
    return coin_median_dic;
  }
  /**
   * get_median price and calcuate differnce rate with median value
   * @param {*} exec_pri_arr 
   * @param {*} median_dic_input 
   */
  calc_diff_rate(exec_pri_arr, median_dic_input) {
    var diff_rate_dic = Object.assign({}, exec_pri_arr);
    for (let coin in exec_pri_arr) {
      for (let side in exec_pri_arr[coin]) {
        for (let market in exec_pri_arr[coin][side]) {
          if (exec_pri_arr[coin][side][market] == -999) continue;
          else {
            if (median_dic_input[coin] == -999) diff_rate_dic[coin][side][market] = -999;
            else diff_rate_dic[coin][side][market] = 100 * ((exec_pri_arr[coin][side][market] / median_dic_input[coin]) - 1);
          }
        }
      }
    }
    return diff_rate_dic;
  }
  /**
   * Example; show the structure of p_v_dic
   * @param {*} p_v_dic 
   */
  show_pv_dic(p_v_dic) {
    for (coin in p_v_dic) {
      console.log(coin)
      for (side in p_v_dic[coin]) {
        console.log(side)
        for (market in p_v_dic[coin][side]) {
          console.log(market)
          for (price in p_v_dic[coin][side][market]) {
            console.log(p_v_dic[coin][side][market][price])
          }
        }
      }
    }
  }
  getResult(data) {
    let exec_pri_arr = this.get_exec_pri_by_amount(this.gen_p_v_dic(data), 1000000)
    let median_dic = this.get_median(exec_pri_arr, 'ask');
    return this.calc_diff_rate(exec_pri_arr, median_dic);
  }
}

module.exports = new Mineral();
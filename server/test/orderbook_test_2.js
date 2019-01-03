const time = process.hrtime();

const orderbookMap = require('./orderbook.data.json');

function gen_p_v_dic(orderbook_by_currency) {
  var p_v_dic = {};
  for (var coin in orderbook_by_currency) {
    temp = get_pv_vector_by_market(orderbook_by_currency[coin])
    p_v_dic[coin] = get_pv_vector_by_market(orderbook_by_currency[coin])
  }
  return p_v_dic;
}


function median(numbers) {
  var median = 0, numsLen = numbers.length;
  numbers.sort();

  if (
    numsLen % 2 === 0 // is even
  ) {
    median = numbers[numsLen / 2 - 1];
  } else { // is odd
    // middle number only
    median = numbers[(numsLen - 1) / 2];
  }

  return median;
}

function calc_pv_arr(orderbook_arr, option) {
  var temp_arr;

  if (option == 'a') {
    temp_arr = orderbook_arr.reverse();
  } else {
    temp_arr = orderbook_arr;
  }

  var cum_vol_arr = new Array();
  var avg_price_arr = new Array();

  var price_vol_v = new Array();


  var pre_vol = 0;
  var pre_avg = 0;
  var curr_vol;
  var order;

  for (var idx of temp_arr.keys()) {

    var order = temp_arr[idx]

    curr_vol = order['amount'] * order['price']
    curr_avg_price = (pre_avg * pre_vol + order['price'] * curr_vol) / (pre_vol + curr_vol)

    //console.log(curr_avg_price)
    pre_vol = pre_vol + order['price'] * order['amount']
    pre_avg = curr_avg_price

    cum_vol_arr[idx] = pre_vol;
    avg_price_arr[idx] = pre_avg;

    price_vol_v[idx] = new Array(2);
    price_vol_v[idx][0] = pre_vol;
    price_vol_v[idx][1] = pre_avg;
  }
  //console.log(price_vol_v)
  return price_vol_v
}

function get_pv_vector_by_market(ab_data_by_coin) {
  var res1 = {};
  var res2 = {};
  for (var market in ab_data_by_coin) {
    //console.log(market)
    var temp = ab_data_by_coin[market]
    var a_side_order = temp.slice(0, 10);
    var b_side_order = temp.slice(10, temp.length);
    res1[market] = calc_pv_arr(a_side_order, 'a');
    res2[market] = calc_pv_arr(b_side_order, 'b');
  }

  return {
    'ask': res1,
    'bid': res2
  }
}

function show_pv_dic(p_v_dic) {
  //Example; show the structure of p_v_dic
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
  return 0;
}

function calc_exec_pri(p_v_vec, target_amount) {
  // calculate execution price at target amount
  //error code description
  // -999/-99: not enough money(actually same meaning)
  // 0 : maybe input error
  if (target_amount > p_v_vec[9][0]) {
    return -999;
  }
  if (target_amount < p_v_vec[0][0]) {
    return p_v_vec[0][1];
  }
  // console.log(p_v_vec);
  var i;
  for (i = 0; i < 10; i++) {
    if (i == 9) {
      return -99;
    }
    if (target_amount < p_v_vec[i + 1][0]) {
      exec_pri = p_v_vec[i][1] + (p_v_vec[i + 1][1] - p_v_vec[i][1]) *
        ((target_amount - p_v_vec[i][0]) / (p_v_vec[i + 1][0] - p_v_vec[i][0]));
      return exec_pri;
    }
  }
  return 0;
}

function get_exec_pri_by_amount(p_v_dic, target_amount) {
  var exec_pri_dic = {};
  for (var coin in p_v_dic) {
    //console.log(coin)
    var coin_a_b_dic = {};
    for (var side in p_v_dic[coin]) {
      var coin_list = {};
      for (var market in p_v_dic[coin][side]) {
        //console.log(coin)             
        //console.log(p_v_dic[coin][side][market])
        coin_list[market] = calc_exec_pri(p_v_dic[coin][side][market], target_amount);
      }
      coin_a_b_dic[side] = coin_list;
    }
    exec_pri_dic[coin] = coin_a_b_dic;
  }
  return exec_pri_dic
}

function get_median(exec_pri_arr, side_option) {
  // side_option = 'bid'/'ask'
  var coin_median_dic = {};
  for (coin in exec_pri_arr) {
    //console.log(coin)
    var price_arr = [];

    for (market in exec_pri_arr[coin][side_option]) {
      //console.log(exec_pri_arr[coin][side_option][market])
      if (exec_pri_arr[coin][side_option][market] == -999) {
        continue;
      } else {
        price_arr.push(exec_pri_arr[coin][side_option][market])
      }
    }

    if (price_arr.length == 0) {
      //console.log(-999)
      coin_median_dic[coin] = -999;
    } else {
      //console.log(math.median(price_arr))
      coin_median_dic[coin] = median(price_arr);
    }
  }
  return coin_median_dic;
}



function calc_diff_rate(exec_pri_arr, median_dic_input) {
  var diff_rate_dic = Object.assign({}, exec_pri_arr);
  for (coin in exec_pri_arr) {
    for (side in exec_pri_arr[coin]) {
      for (market in exec_pri_arr[coin][side]) {
        if (exec_pri_arr[coin][side][market] == -999) {
          continue;
        } else {
          if (median_dic_input[coin] == -999) {
            diff_rate_dic[coin][side][market] = -999;
          } else {
            diff_rate_dic[coin][side][market] = 100 * ((exec_pri_arr[coin][side][market] / median_dic_input[coin]) - 1);
          }
        }
      }
    }
  }
  return diff_rate_dic;
}


//1. import orderbook data

// var orderbookMap = data;



//2. Get Execute Price and volume dictionary
//  Executive price : arithmetic average @ amount
//  Volume : accumulated volume 
var orderbookMap_usd = orderbookMap.USD;
var orderbook_krw = orderbookMap.KRW;


var p_v_dic = gen_p_v_dic(orderbook_krw)
//show_pv_dic(p_v_dic)

//Example; show the structure of p_v_dic
//show_pv_dic(p_v_dic)

//3. get executive price at target amount
//     simple interpolating is used in calculating price 
// var list = [500, 5000,50000,500000,5000000,50000000000000]
// for (i in list){
//     console.log(get_exec_pri_by_amount(p_v_dic, list[i]))
// }



//4. get_median price and calcuate differnce rate with median value


// for (var i =0 ; i<1000000; i += 100){
var exec_pri_arr = get_exec_pri_by_amount(p_v_dic, 1000000)
//console.log(exec_pri_arr)
median_dic = get_median(exec_pri_arr, 'ask');
//console.log(median_dic)
final_diff_dic = calc_diff_rate(exec_pri_arr, median_dic);
console.log(final_diff_dic)
// }





/*

var p_v_dic ={};
for ( var coin of orderbookMap.keys()){
    temp = get_pv_vector_by_market(orderbookMap.get(coin))
    p_v_dic[coin] = get_pv_vector_by_market(orderbookMap.get(coin))
}

*/
const diff = process.hrtime(time);
// [ 1, 552 ]
const NS_PER_SEC = 1e9;
console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
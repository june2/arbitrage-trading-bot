// @flow
import React, { Component } from 'react';
import Trading from '../components/trading/Trading';
import CryptomapService from '../services/cryptomap.service';
import WindowResize from 'react-window-resize'

export default class TradingPage extends Component<Props> {
  constructor(props) {
    super(props);
    let data = this._parseData(props.location.search);
    this.state = {
      coin: data.coin,
      from: data.from,
      exchanges: data.exchanges.split(',')
    };    
  }
  _parseData(search) {
    let data = search.replace('?', '').split('&');
    let result = {};
    data.forEach((part) => {
      let item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
  render() {
    return (<WindowResize width={'1200'} height={(this.state.exchanges.length) * 50 + 22}>
      <Trading coin={this.state.coin} from={this.state.from} exchanges={this.state.exchanges} />
    </WindowResize>);
  }
}

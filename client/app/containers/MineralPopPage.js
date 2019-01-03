import React, { Component } from 'react';
import { Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { isEmptyObject } from '../utils';
import { formatMoney } from '../../app/utils';
import MineralPop from '../components/mineralPop/MineralPop';
import Wallet from '../components/wallet/Wallet';
import JtmService from '../../app/services/jtm.service';
import WindowResize from 'react-window-resize'
import Config from '../constants/config';


export default class MineralPopPage extends Component<Props> {
  constructor(props) {
    super(props);
    let data = this._parseData(props.location.search);
    this.state = {
      currency: data.currency,
      coin: data.coin,
      orderbooks: [],
      balances: {},
      updateTime: null,
      seconds: 0,
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
  componentWillMount() {
    let data = JSON.stringify({ method: "subscribe", param: "ratio" });
    this.ws = new WebSocket(`ws://${Config.apiUrl}:3000`)
    this.ws.onopen = () => {
      this.ws.send(data);
    };
    this.ws.onmessage = msg => {
      if (msg.data) {
        let json = JSON.parse(msg.data)
        let books = json[this.state.currency][this.state.coin];
        if (books && !isEmptyObject(books)) {
          this.setState({ orderbooks: books });
          this.setState({ seconds: 0 });
        }
      }
    };
    this.ws.onclose = e => e.wasClean;
  }
  componentWillUnmount() {
    this.ws.close();
  }
  componentDidMount() {
    this.refs.Table1.style['background'] = '#e9ecef';
    this.refs.Table2.style['padding-top'] = '100px';
    // this.refs.Table2.style['padding-bottom'] = '198px';
    this.interval = setInterval(() => this.tick(), 1000);
  }
  tick() {
    this.setState(prevState => ({ seconds: prevState.seconds + 1 }));
  }
  render() {
    return (<WindowResize width={'540'} height={'1000'}>
      <div className="fixed-top" ref="Table1">
        <Table>
          <thead>
            <tr className="text-center">
              <th colSpan='2'>ASK</th>
              <th>
                <div style={{ fontSize: '15px' }}>{this.state.currency} - {this.state.coin}</div>
                <div style={{ fontSize: '10px' }}>{this.state.seconds}</div>
              </th>
              <th colSpan='2'>BID</th>
            </tr>
            <tr className="text-center">
              <th>AMOUNT</th>
              <th>MARKET</th>
              <th>PRICE</th>
              <th>MARKET</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
        </Table>
      </div>
      <div ref="Table2">
        <MineralPop balances={this.state.balances} orderbooks={this.state.orderbooks} coin={this.state.coin} currency={this.state.currency} />
      </div>
      {/* <div className="fixed-bottom" style={{ background: '#e9ecef' }}>
        <Wallet coin={this.state.coin} currency={this.state.currency} />
      </div> */}
    </WindowResize>);
  }
}

import React, { Component } from 'react';
import { Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import Signal from '../components/signal/Signal';
import Wallet from '../components/wallet/Wallet';
import JtmService from '../services/jtm.service';
import WindowResize from 'react-window-resize'

export default class SignalPage extends Component<Props> {
  constructor(props) {
    super(props);
    let data = this._parseData(props.location.search);
    this.state = {
      currency: data.currency,
      coin: data.coin
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
  }
  componentDidMount() {
  }
  render() {
    return (<WindowResize width={'540'} height={'1000'}>
      <div className="fixed-top" style={{ background: '#e9ecef' }}>
        <Table>
          <thead>
            <tr className="text-center">              
              <th>
                <div style={{ fontSize: '15px' }}>{this.state.currency} - {this.state.coin}</div>
                <div style={{ fontSize: '10px' }}>{this.state.seconds}</div>
              </th>              
            </tr>            
          </thead>
        </Table>
      </div>
      <div style={{ paddingTop: '48px' }}>
        <Signal coin={this.state.coin} currency={this.state.currency} />
      </div>
      <div className="fixed-bottom" style={{ background: '#e9ecef' }}>
        <Wallet coin={this.state.coin} currency={this.state.currency} />
      </div>
    </WindowResize>);
  }
}

// @flow
import React, { Component } from 'react';
import Info from '../components/info/Info';
import CryptomapService from '../../app/services/cryptomap.service';

export default class InfoPage extends Component<Props> {
  constructor() {
    super();
    this.state = {
      ratios: []
    };
  }
  componentWillMount() {
    let data = JSON.stringify({ method: "subscribe", param: "ratio" });
    this.ws = new WebSocket('ws://192.168.0.24:3000')
    this.ws.onopen = () => {
      this.ws.send(data);
    };
    this.ws.onmessage = msg => {      
      if (msg.data) this.setState({ ratios: JSON.parse(msg.data) });
    };
    this.ws.onclose = e => e.wasClean;
  }
  componentWillUnmount() {
    this.ws.close();
  }
  render() {
    return <Info ratios={this.state.ratios} />;
  }
}

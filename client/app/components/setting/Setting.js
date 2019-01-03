import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Table, thead, tbody, tr, th, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import Switch from "react-switch";
import { withAlert } from "react-alert";
import { refresh } from '../../actions/market';
import JtmService from '../../services/jtm.service';
import routes from '../../constants/routes';
import styles from './Setting.css';

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency,
      settings: [],
      save: [],
    };
    this.setSettings(props.currency)
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  componentWillReceiveProps(props) {
    this.setState({ currency: props.currency });
    this.setState({ exchanges: props.exchanges });
    this.setSettings(props.currency)
  }
  async setSettings(currency) {
    let data = await JtmService.getCoins(currency);
    this.setState({ settings: data });
  }
  /**
   * 변경사항 저장
   */
  async save() {    
    let res = await JtmService.updateMarketcoins(this.state.save);
    if (res.status === 204) {
      this.state.save = [];
      this.props.alert.success("저장되었습니다!");
    }
  }
  /**
   * Change activation button 
   * @param {*} i 
   * @param {*} exchange 
   */
  changeSwitch(i, exchange) {
    for (let marketcoin of this.state.settings[i].marketcoins) {
      if (marketcoin.marketId === exchange) {
        marketcoin.enabled = marketcoin.enabled ? false : true;
        break;
      }
    }
    this.setState({ settings: this.state.settings });
    this.updateChanged(i);
  }
  /**
   * change input value
   * @param {*} type 
   * @param {*} i 
   * @param {*} val 
   */
  changeVal(type, i, val) {
    switch (type) {
      case 'min':
        this.state.settings[i].min = val;
        break;
      case 'max':
        this.state.settings[i].max = val;
        break;
      case 'target':
        this.state.settings[i].target = val;
        break;
    }
    this.setState({ settings: this.state.settings });
    this.updateChanged(i);
  }
  /**
   * 수정된 데이타만 서버에 update요청하기 위한 함수
   * @param {*} i 
   */
  updateChanged(i) {
    for (let [index, data] of this.state.save.entries()) {
      if (data.id === this.state.settings[i].id) {
        return this.state.save[index] = this.state.settings[i];
      }
    }
    this.state.save.push(this.state.settings[i]);
  }
  renderTable(i, coin, min, max, target, marketcoins) {
    if (this.state.exchanges && marketcoins.length > 1) {
      return (<tr key={i} className="text-center">
        <td>{coin}</td>
        <td><Input placeholder="min" type="number" value={min} onChange={(e) => this.changeVal('min', i, e.target.value)} /></td>
        <td><Input placeholder="max" type="number" value={max} onChange={(e) => this.changeVal('max', i, e.target.value)} /></td>
        <td><Input placeholder="%" type="number" value={target} onChange={(e) => this.changeVal('target', i, e.target.value)} /></td>
        {this.state.exchanges.map((exchange, j) => {
          let enabled = null;
          for (let market of marketcoins) {
            if (market.marketId == exchange) {
              enabled = market.enabled;
              break;
            }
          }
          if (null !== enabled) {
            return (<td key={j}><Switch
              onChange={() => this.changeSwitch(i, exchange)}
              checked={enabled}
              id="normal-switch"
            /></td>);
          } else {
            return (<td key={j}>-</td>);
          }
        })}
      </tr>);
    }
  }
  render() {
    return (
      <tbody>
        {this.state.settings.map((setting, i) => {
          return (this.renderTable(i, setting.id, setting.min, setting.max, setting.target, setting.marketcoins));
        })}
      </tbody>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  let obj = dispatch(refresh());
  return obj ? obj : {};
}

Setting = connect(undefined, mapDispatchToProps)(Setting);

export default withAlert(Setting);

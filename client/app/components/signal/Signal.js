import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils';
import JtmService from '../../services/jtm.service';
import routes from '../../constants/routes';
import styles from './Signal.css';

class Signal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency,
      coin: props.coin,
      signals: []
    };
  }
  componentDidMount() {
    setInterval(async () => {
      let res = await JtmService.getSignals(this.state.currency, this.state.coin);      
      this.setState({ signals: res });
      let d = new Date(res.updateTime);
      let time = `${d.getHours()} : ${d.getMinutes()} : ${d.getSeconds()}`;
      this.setState({ updateTime: time });
    }, 1000 * 5);
  }
  renderSignals(signal, i) {
    let tables = [];
    let asks = [];
    let bids = [];
    let d = new Date(signal.time);
    for (let [index, order] of signal.signalorders.entries()) {
      if (order.type === 'a') {
        asks.push(<div key={index}>{order.marketId} : {formatMoney(order.price, 0)} : {order.amount}</div>);
      } else {
        bids.push(<div key={index}>{order.marketId} : {formatMoney(order.price, 0)} : {order.amount}</div>);
      }
    }
    tables.push(<tr key={i} className={`text-center ${((i % 2) === 0 ? styles.stripe : '')}`}>
      <th>TIME</th>
      <th>TARGET</th>
      <th>MIN</th>
      <th>MAX</th>
    </tr >)
    tables.push(<tr key={i + 1} className={`text-center ${((i % 2) === 0 ? styles.stripe : '')}`}>
      <th>
        <div className={`${styles.date}`}>{d.getMonth() + 1}/{d.getDay()}</div>
        <div className={`${styles.date}`}>{d.getHours()}:{d.getMinutes()}:{d.getSeconds()}</div>         
      </th>
      <th className="align-middle">{signal.target}%</th>
      <th className="align-middle">{signal.min}</th>
      <th className="align-middle">{signal.max}</th>
    </tr>)
    tables.push(<tr key={i + 2} className={`text-center ${styles[`border-double`]} ${((i % 2) === 0 ? styles.stripe : '')}`}>
      <th colSpan='2' className="align-middle">{bids}</th>
      <th colSpan='2' className="align-middle">{asks}</th>
    </tr>)
    return tables;
  }
  render() {
    return (
      <Table className="table">
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <tbody>
          {this.state.signals.map((signal, i) => {
            return (
              this.renderSignals(signal, i)
            );
          })}
        </tbody>
      </Table>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    coins: state.coins,
    currencies: state.currencies
  };
}

Signal = connect(mapStateToProps)(Signal);

export default Signal;

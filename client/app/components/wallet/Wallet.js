// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils';
import JtmService from '../../services/jtm.service';
import styles from './Wallet.css';

class Signal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency,
      coin: props.coin,
      balances: {},
    };
  }
  componentDidMount() {
    setInterval(async () => {
      let res = await JtmService.getBalances(this.state.currency, this.state.coin);
      this.setState({ balances: res.balances });
      let d = new Date(res.updateTime);
      let time = `${d.getHours()} : ${d.getMinutes()} : ${d.getSeconds()}`;
      this.setState({ updateTime: time });
    }, 1000 * 5);
  }
  renderBalence(i, market, price) {
    return (<tr key={i} className="text-center">
      <td>{market}</td>
      <td>{formatMoney(price.KRW)}</td>
      <td>{price[this.state.coin]}</td>
    </tr>);
  }
  render() {
    return (
      <Table>
        <thead>
          <tr className="text-center">
            <th>{this.state.updateTime}</th>
            <th>{this.state.currency}</th>
            <th>{this.state.coin}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.state.balances).map((key, i) => {
            return (
              this.renderBalence(i, key, this.state.balances[key])
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

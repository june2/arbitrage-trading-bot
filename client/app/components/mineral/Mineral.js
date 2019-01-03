import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils';
import CryptomapService from '../../services/cryptomap.service';
import routes from '../../constants/routes';
import styles from './Mineral.css';

class Mineral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'KRW',
      minerals: [],
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ currency: props.currency });
    this.setState({ minerals: props.minerals[this.state.currency] });
  }
  /**
   * 
   * @param {*} i 
   * @param {*} coin 
   * @param {*} prices 
   */
  renderPrice(i, coin, info) {
    let asks = [];
    let bids = [];
    let orderbook = info.orderbook;
    let low = info.min;
    let high = info.max;
    if (orderbook && orderbook[low]) {
      Object.entries(orderbook[low].ask).map((key, val) => {
        return asks.push(<div key={key}>{key[0]} : {key[1]}</div>);
      })
    }
    if (orderbook && orderbook[high]) {
      Object.entries(orderbook[high].bid).map((key, val) => {
        return bids.push(<div key={key}>{key[0]} : {key[1]}</div>);
      })
    }
    return (<tr key={i} className="text-center">
      <td>
        <Link target='_blank' to={{ pathname: routes.MINERALPOP, search: `coin=${coin}&currency=${this.state.currency}` }}>
          {coin}
        </Link>
      </td>
      <td>
        <Link target='_blank' to={{ pathname: routes.SIGNAL, search: `coin=${coin}&currency=${this.state.currency}` }}>
          {(((high - low) / low) * 100).toFixed(2)} %
        </Link>
      </td>
      <td>{formatMoney(low)}</td>
      <td>{asks}</td>
      <td>{formatMoney(high)}</td>
      <td>{bids}</td>
    </tr>);
  }
  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr className="text-center">
              <th>COIN</th>
              <th>괴리율</th>
              <th>최저매수가</th>
              <th>최저매수 마켓</th>
              <th>최고매도가</th>
              <th>최고매도 마켓</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.state.minerals).map((key, i) => {
              return (this.renderPrice(i, key[0], key[1]));
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    coins: state.coins,
    currencies: state.currencies
  };
}

Mineral = connect(mapStateToProps)(Mineral);

export default Mineral;

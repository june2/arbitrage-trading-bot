import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils';
import CryptomapService from '../../services/cryptomap.service';
import routes from '../../constants/routes';
import styles from './MineralPop.css';

class MineralPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      orderbooks: [],      
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ orderbooks: props.orderbooks });    
  }
  /**
   * change market list
   * @param {*} i 
   */
  renderOrderBook(i, price, order) {
    let askMarkets = [];
    let askAmouts = [];
    let bidMarkets = [];
    let bidAmounts = [];
    Object.entries(order.bid).map((key, val) => {
      bidMarkets.push(<div key={val}>{key[0]}</div>);
      bidAmounts.push(<div key={val}>{key[1]}</div>);
    })
    Object.entries(order.ask).map((key, val) => {
      askMarkets.push(<div key={val}>{key[0]}</div>);
      askAmouts.push(<div key={val}>{key[1]}</div>);
    })
    return (<tr key={i} className="text-center">
      <td style={{ backgroundColor: 'rgba(0, 123, 255, 0.25)' }}>{askAmouts}</td>
      <td style={{ backgroundColor: 'rgba(0, 123, 255, 0.25)' }}>{askMarkets}</td>
      <td>{formatMoney(price)}</td>
      <td style={{ backgroundColor: 'rgba(232, 62, 140, 0.28)' }}>{bidMarkets}</td>
      <td style={{ backgroundColor: 'rgba(232, 62, 140, 0.28)' }}>{bidAmounts}</td>
    </tr>);
  }
  render() {
    return (
      <div>
        <Table>
          <tbody>
            {Object.keys(this.state.orderbooks).reverse().map((key, i) => {
              return (
                this.renderOrderBook(i, key, this.state.orderbooks[key])
              );
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

MineralPop = connect(mapStateToProps)(MineralPop);

export default MineralPop;

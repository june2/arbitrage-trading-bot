import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import CryptomapService from '../../services/cryptomap.service';
import routes from '../../constants/routes';
import styles from './Info.css';

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: null,
      currencies: [],
      exchanges: [],
      coins: [],
      ratios: null
    };
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
  }
  // async componentWillMount() {
  //   if (this.props.currencies) {
  //     this.setState({ currencies: this.props.currencies });
  //     this.setState({ currency: this.state.currencies[2]._id });
  //     this.setState({ exchanges: this.props.currencies[2].data });
  //     this.setState({ coins: this.props.coins });
  //   } else {
  //     let data = await CryptomapService.getInfo();
  //     this.setState({ currencies: data.currencies });
  //     this.setState({ currency: data.currencies[2]._id });
  //     this.setState({ exchanges: data.currencies[2].data });
  //     this.setState({ coins: data.coins });
  //   }
  // }
  componentWillReceiveProps(props) {
    this.setState({ ratios: props.ratios[this.state.currency] });
  }
  /**
   * change market list
   * @param {*} i 
   */
  changeMineral(i) {
    this.setState({ currency: this.state.currencies[i]._id });
    this.setState({ exchanges: this.state.currencies[i].data });
  }
  openWindow(from, coin, exchanges) {
    window.open(this.makeHref(routes.TRADING), 'coin', 'resizable,height=260,width=370');
  }
  renderRatio(coin, exchanges) {
    let table = []
    for (let [i, v] of exchanges.entries()) {
      if (this.state.ratios && this.state.ratios[coin] && this.state.ratios[coin][v]) {
        table.push(
          <td key={i}>
            <Link target='_blank' to={{ pathname: routes.TRADING, search: `from=${v}&coin=${coin}&exchanges=${exchanges}` }}>
              {this.state.ratios[coin][v][0].price}
            </Link>
          </td >
        )
      } else {
        table.push(<td key={i}>-</td>)
      }
    }
    return table
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Link to={routes.HOME}><i className="fa fa-arrow-left fa-3x" /></Link>
          <Nav className="ml-auto" navbar>
            {this.state.currencies.map((currency, i) => {
              return (
                <NavItem key={i}>
                  <NavLink style={(currency._id === this.state.currency) ? { color: `black` } : {}}
                    value={i} onClick={() => this.changeMineral(i)}>{currency._id}</NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </Navbar>
        <Table>
          <thead>
            <tr className="text-center">
              <th style={{ width: '10%' }}></th>
              {this.state.exchanges.map((exchage, i) => {
                return (
                  <th style={{ width: `${(90 / this.state.exchanges.length)}%` }} key={i}>{exchage}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.coins.map((coin, i) => {
              return (
                <tr key={i} className="text-center">
                  <td>{coin._id}</td>
                  {this.renderRatio(coin._id, this.state.exchanges)}
                </tr>
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

Info = connect(mapStateToProps)(Info);

export default Info;

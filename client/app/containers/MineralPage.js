import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../app/utils';
import Mineral from '../components/mineral/Mineral';
import CryptomapService from '../services/cryptomap.service';
import routes from '../constants/routes';
import Config from '../constants/config';

export default class MineralPage extends Component<Props> {
  constructor() {
    super();
    this.state = {
      minerals: { KRW: {}, USD: {}, BTC: {} },
      currency: 'KRW',
      currencies: [],
      seconds: 0,
    };
  }
  componentWillMount() {
    let data = JSON.stringify({ method: "subscribe", param: "mineral" });
    this.ws = new WebSocket(`ws://${Config.apiUrl}:3000`)
    this.ws.onopen = () => {
      this.ws.send(data);
    };
    this.ws.onmessage = msg => {
      if (msg.data) {        
        this.setState({ minerals: JSON.parse(msg.data) });
        this.setState({ seconds: 0 });
      }
    };
    this.ws.onclose = e => e.wasClean;
  }
  componentWillUnmount() {
    this.ws.close();
  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
    this.setInfo();
  }
  async setInfo() {
    if (this.props.currencies) {
      this.setState({ currencies: this.props.currencies });
    } else {
      let data = await CryptomapService.getInfo();
      this.setState({ currencies: data.currencies });
    }
  }
  tick() {
    this.setState(prevState => ({ seconds: prevState.seconds + 1 }));
  }
  /**
   * change market list
   * @param {*} i 
   */
  changeCurrency(i) {
    this.setState({ currency: this.state.currencies[i]._id });
    this.setState({ minerals: { KRW: {}, USD: {}, BTC: {} } });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Link to={routes.HOME}><i className="fa fa-arrow-left fa-1x" /></Link>
          <span style={{ paddingRight: '50px' }}></span>
          <Link to={routes.SETTING}><i className="fa fa-cog fa-1x" /></Link>
          <span style={{ paddingLeft: '50px' }}>{this.state.seconds}</span>
          <Nav className="ml-auto" navbar>
            {this.state.currencies.map((currency, i) => {
              return (
                <NavItem key={i}>
                  <NavLink style={(currency._id === this.state.currency) ? { color: `black` } : {}}
                    value={i} onClick={() => this.changeCurrency(i)}>{currency._id}</NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </Navbar>
        <Mineral minerals={this.state.minerals} currency={this.state.currency} />
      </div>);
  }
}

import React, { Component } from 'react';
import { Provider } from "react-alert";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import AlertTemplate from "react-alert-template-basic";
import Setting from '../components/setting/Setting';
import routes from '../constants/routes';
import CryptomapService from '../services/cryptomap.service';
import JtmService from '../services/jtm.service';

export default class SettingPage extends Component<Props> {
  constructor() {
    super();
    this.state = {
      minerals: { KRW: {}, USD: {}, BTC: {} },
      currency: 'KRW',
      currencies: [],
      exchanges: [],
    };
  }
  async componentDidMount() {
    if (this.props.currencies) {
      this.setState({ currencies: this.props.currencies });
      this.setState({ exchanges: this.props.currencies[1].data });
    } else {
      let data = await CryptomapService.getInfo();
      this.setState({ currencies: data.currencies });
      this.setState({ exchanges: data.currencies[1].data });
    }
  }
  changeCurrency(i) {
    this.setState({ currency: this.state.currencies[i]._id });
    this.setState({ exchanges: this.state.currencies[i].data });
    this.setState({ minerals: { KRW: {}, USD: {}, BTC: {} } });
  }
  render() {
    const options = {
      timeout: 5000,
      position: "bottom center"
    };
    return (
      <Provider template={AlertTemplate} {...options}>
        <div>
          <Navbar color="light" light expand="md">
            <Link to={routes.MINERAL}><i className="fa fa-arrow-left fa-1x" /></Link>
            <span style={{ paddingRight: '50px' }}></span>
            <a style={{ color: '#007bff' }}><i onClick={() => this.child.save()} className="fas fa-save"></i></a>
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
          <div>
            <Table className="table-bordered">
              <thead>
                <tr className="text-center">
                  <th style={{ width: '120px' }} rowSpan="2" className="align-middle">코인</th>
                  <th colSpan="3">주문파라미터</th>
                  <th colSpan={this.state.exchanges.length}>거래소선택</th>
                </tr>
                <tr className="text-center">
                  <th style={{ width: '150px' }}>주문 min</th>
                  <th style={{ width: '150px' }}>주문 max</th>
                  <th style={{ width: '150px' }}>목표 괴리율</th>
                  {this.state.exchanges.map((exchage, i) => {
                    return (
                      <th style={{ width: `${(40 / this.state.exchanges.length)}%` }} key={i}>{exchage}</th>
                    );
                  })}
                </tr>
              </thead>
              <Setting onRef={ref => (this.child = ref)} currency={this.state.currency} exchanges={this.state.exchanges} />
            </Table>
          </div>
        </div>
      </Provider >
    );
  }
}


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Table, thead, tbody, tr, th } from 'reactstrap';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { refresh } from '../../actions/market';
import styles from './Trading.css';

class Trading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { coin, from, exchanges } = this.props;    
    return (
      <div className={styles.box}>
        <Table>
          <thead>
            <tr className="text-center">
              <th>ON / OFF</th>
              <th>주문 수량</th>
              <th>출발 거래소</th>
              <th>출발 수량</th>
              <th>코인</th>
              <th>도착 거래소</th>
              <th>도착 수량</th>
              <th>설정 괴리율</th>
              <th>실제 괴리율</th>
              <th>체결</th>
              <th>거래선택</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange, i) => {
              if (exchange !== from) {
                return (
                  <tr key={i} className="text-center">
                    <td></td>
                    <td></td>
                    <td>{from}</td>
                    <td></td>
                    <td>{coin}</td>
                    <td>{exchange}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                );
              }
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  let obj = dispatch(refresh());
  return obj ? obj : {};
}

Trading = connect(undefined, mapDispatchToProps)(Trading);

export default Trading;

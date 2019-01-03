// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { refresh } from '../../actions/market';
import routes from '../../constants/routes';
import styles from './Home.css';

class Home extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.box}>
        <div className={styles.center}>
          <div>
            <h2>JTM</h2>
          </div>
          <div className={styles.vertical}>
            ver {data.version}
          </div>
          {/* <div className={styles.vertical}>
            <Link to={routes.INFO}>START</Link>
          </div> */}
          <div className={styles.vertical}>            
            <Link to={routes.MINERAL}>START</Link>
          </div>            
        </div>
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {    
  let obj = dispatch(refresh());
  return obj ? obj : {}; 
}

Home = connect(undefined, mapDispatchToProps)(Home);

export default Home;

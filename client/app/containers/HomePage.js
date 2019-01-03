// @flow
import React, { Component } from 'react';
import Home from '../components/home/Home';
import JtmService from '../../app/services/jtm.service';

export default class HomePage extends Component<Props> {
  constructor() {
    super();
    this.state = { data: {} };
  }
  componentWillMount() {
    this.getInfo();
  }
  async getInfo() {
    const res = await Promise.all([JtmService.getVersion()]);
    this.setState({ data: res[0] });
  }
  render() {
    const { data } = this.state;
    return <Home data={data} />;
  }
}

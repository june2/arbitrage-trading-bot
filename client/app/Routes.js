import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SettingPage from './containers/SettingPage';
import InfoPage from './containers/InfoPage';
import SignalPage from './containers/SignalPage';
import MineralPage from './containers/MineralPage';
import MineralPopPage from './containers/MineralPopPage';
import TradingPage from './containers/TradingPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} exact component={HomePage} />
      <Route path={routes.INFO} component={InfoPage} />
      <Route path={routes.SETTING} component={SettingPage} />
      <Route path={routes.TRADING} component={TradingPage} />
      <Route path={routes.SIGNAL} exact component={SignalPage} />
      <Route path={routes.MINERAL} exact component={MineralPage} />
      <Route path={routes.MINERALPOP} exact component={MineralPopPage} />
    </Switch>
  </App>
);

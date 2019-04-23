import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';

import Layout from './layout';
import Square from './pages/square';
import NotFound from './pages/notfound';

const AppLayout = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Square} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);

export default () => (
  <HashRouter>
    <AppLayout />
  </HashRouter>
);
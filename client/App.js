import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';

import Layout from './layout';
import Content from './pages/content';
import Resume from './pages/resume';
import Square from './pages/square';
import NotFound from './pages/notfound';

const AppLayout = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Content} />
      <Route path="/content" component={Content} />
      <Route path="/resume" component={Resume} />
      <Route exact path="/square" component={Square} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);

export default () => (
  <HashRouter>
    <AppLayout />
  </HashRouter>
);
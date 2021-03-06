import React, { PureComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ExchangeList from './scenes/ExchangeList';
import ExchangeDetail from './scenes/ExchangeDetail';

import './App.css';

const routes = [{
  path: '/',
  component: ExchangeList
},{
  path: '/:id',
  component: ExchangeDetail
}];

class App extends PureComponent {
  render = () => (
    <BrowserRouter basename="/">
      <div className="App">
        <Switch>
          {routes.map((item, index) => (
            <Route key={index} exact path={item.path} component={item.component} />
          ))}
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;

import React from 'react';
import './App.scss';
import Homepage from './pages/homepage/homepage.component';
import Instellingenpage from './pages/instellingenpage/instellingenpage.component';
import Waterpage from './pages/waterpage/waterpage.component';
import Geschiedenispage from './pages/geschiedenispage/geschiedenispage.component';
import { Switch, Route } from 'react-router-dom';


class App extends React.Component {

  render(){
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/instellingen' component={Instellingenpage}/>
          <Route exact path='/waterniveau' component={Waterpage}/>
          <Route exact path='/geschiedenis' component={Geschiedenispage}/>
        </Switch>
      </div>
    );
  }
}

export default App;


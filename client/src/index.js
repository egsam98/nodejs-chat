import React from 'react';
import ReactDOM from 'react-dom';
import About from './About';
import Chat from './Chat/Chat';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import registerServiceWorker from './serviceWorker';

ReactDOM.render(
        <Router basename="/">
            <Switch>
                <Route path="/" component={Chat}/>
                <Route path="/about" component={About}/>
                <Redirect to={'/'} />
            </Switch>
        </Router>
    , document.getElementById('root'));




import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/login';
import Ticket from './pages/ticket';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login}/>
                <Route path='/ticket' exact component={Ticket}/>
            </Switch>
        </BrowserRouter>
    );
}
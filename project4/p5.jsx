import React from "react";
import ReactDOM from "react-dom";

import Header from "./components/Header";
import States from "./components/States";
import Example from "./components/Example";
import Switch from "./components/Switch"

import { HashRouter, Route, Link } from "react-router-dom";

const App = () => {
    return (
        <HashRouter>
            <div className="container">
                <div className="toolbar">
                    <Link to="/example">
                        <button className="active">Example</button>
                    </Link>
                    <Link to="/states">
                        <button>States</button>
                    </Link>
                </div>
                <Switch>
                    <Route path = "/states" component={States}/>
                    <Route path = "/example" component={Example}/>
                    <Route path = "/" component={Example}/>
                </Switch>

            </div>
        </HashRouter>
    );
};

ReactDOM.render(<div><Header/><App/></div>
    , document.getElementById("reactapp"));
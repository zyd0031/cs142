import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import {Route, Switch, Redirect, BrowserRouter as Router} from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const PhotoShare = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = async () => {
    try{
      const response = await fetch("/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok){
        const err = await response.text();
        throw new Error(err);
      }

      const message = await response.text();
      console.log(message);
      setLoggedInUser(null);
    } catch (error){
      console.error("Failed to logout: ", error);
    }
  };


  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={loggedInUser} onLogout={handleLogout} />
          </Grid>
          <div className="cs142-main-topbar-buffer"></div>
          <Grid item sm={3}>
            <Paper className="cs142-main-grid-item">
              {loggedInUser && <UserList />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="cs142-main-grid-item">
              <Switch>
                <Route
                  path="/login"
                  render={(props) => (
                    loggedInUser ? <Redirect to="/" /> : <LoginRegister onLogin={handleLogin} />
                  )}
                />
                <Route
                  path="/users/:userId"
                  render={(props) => (
                    loggedInUser ? <UserDetail {...props} /> : <Redirect to="/login" />
                  )}
                />
                <Route
                  path="/photos/:userId"
                  render={(props) => (
                    loggedInUser ? <UserPhotos {...props} /> : <Redirect to="/login" />
                  )}
                />
                <Route
                  path="/users"
                  render={(props) => (
                    loggedInUser ? <UserList {...props} /> : <Redirect to="/login" />
                  )}
                />
                <Route
                  path="/"
                  render={() => (
                    loggedInUser ? (
                      <Typography variant="h6">Welcome to the PhotoShare App</Typography>
                    ) : (
                      <Redirect to="/login" />
                    )
                  )}
                />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );

};

ReactDOM.render(<PhotoShare/>, 
  document.getElementById('photoshareapp'));
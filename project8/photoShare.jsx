import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import {Route, Switch, Redirect, BrowserRouter as Router} from "react-router-dom";
import axios from "axios";

import "./styles/main.css";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import PhotoUpload from "./components/PhotoUpload";
import Activities from "./components/Activities";


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
      setLoggedInUser(null);
    } catch (error){
      console.error("Failed to logout: ", error);
    }
  };

  const handleDeleteUser = async() => {
    if (window.confirm("Are you sure you want to delete your account?\nThis action cannot be undone.")){
      try{
        const response = await axios.delete(`/users/${loggedInUser._id}`);
        setLoggedInUser(null);
      } catch (error) {
        console.error("Failed to delete user: ", error);
        alert("Failed to delete account.")
      }
    }
  };



  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={loggedInUser} onLogout={handleLogout} handleUserDelete={handleDeleteUser}/>
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
                    loggedInUser ? <UserPhotos {...props} user={loggedInUser} /> : <Redirect to="/login" />
                  )}
                />
                <Route
                  path="/users"
                  render={(props) => (
                    loggedInUser ? <UserList {...props} /> : <Redirect to="/login" />
                  )}
                />
                <Route 
                  path="/upload"
                  render={(props) => (
                    loggedInUser ? <PhotoUpload user={loggedInUser} /> : <Redirect to="/login" />
                  )}
                />
                <Route 
                  path="/activities"
                  render={(props) => (
                    loggedInUser ? <Activities {...props}  /> : <Redirect to="/login" />
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
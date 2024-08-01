import React, {useEffect, useState} from "react";
import { AppBar, Toolbar, Typography, Button} from "@mui/material";
import { useLocation, Link } from 'react-router-dom';
import axios from "axios";
import {useHistory} from "react-router-dom";
import "./styles.css";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */

const determineContext = (location, user) => {
  const path = location.pathname;
  let userName;

  userName = user ? `${user.first_name} ${user.last_name}` : " ";

  if (path.includes("/photos/")){
    return `Photos of ${userName}`
  }else{
    return userName;
  }

}

const TopBar = ({user, onLogout}) => {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const [rightSideText, setRightSideText]= useState("");
  const [displayedUser, setDisplayedUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (userId) {
      axios.get(`/user/${userId}`)
        .then(response => {
          setDisplayedUser(response.data);
          setRightSideText(determineContext(location, response.data));
        })
        .catch(error => {
          console.error("Fail to fetch user: ", error);
          setDisplayedUser(null);
          setRightSideText("Fail to load user data");
        });
    }
  }, [userId, location]);

  const handleLogoutClick = async() => {
    try{
      await onLogout();
      history.push("/login");
    }catch (error){
      console.error("Failed to logout: ", error);
    }
  };

  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar>
        {user ? (
          <>
            <Typography variant="h5" color="inherit">
              My Name~~
            </Typography>
            <Typography variant="h5">
              {rightSideText}
            </Typography>
            <Typography variant="h6">
              Hi {user.first_name}
            </Typography>
            <div style={{ flexGrow: 1 }}></div>
            <Button color="inherit" onClick={handleLogoutClick} style={{ border: '1px solid white' }}>Logout</Button>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6">
              Please Login
            </Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}


export default TopBar;

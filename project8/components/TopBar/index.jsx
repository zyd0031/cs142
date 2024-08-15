import React, { useEffect, useState, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, Link } from 'react-router-dom';
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */

const determineContext = (location, user) => {
  const path = location.pathname;
  let userName;

  userName = user ? `${user.first_name} ${user.last_name}` : " ";

  if (path.includes("/photos/")) {
    return `Photos of ${userName}`;
  } else {
    return userName;
  }
}

const TopBar = ({ user, onLogout }) => {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const [rightSideText, setRightSideText] = useState("");
  const [displayedUser, setDisplayedUser] = useState(null);
  const history = useHistory();
  const uploadInput = useRef(null); 

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

  const handleLogoutClick = async () => {
    try {
      await onLogout();
      history.push("/login");
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  const handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (uploadInput.current.files.length > 0) {
      const domForm = new FormData();
      domForm.append('uploadedphoto', uploadInput.current.files[0]);
      axios.post('/photos/new', domForm)
        .then((res) => {
          console.log(res);
          alert('Photo uploaded successfully!');
          history.push(`/photos/${user._id}`);
        })
        .catch(err => {
          console.log(`POST ERR: ${err}`);
          alert('Failed to upload photo.');
        });
    }
  };

  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar style={{display: "flex"}}>
        {user ? (
          <>
            <Box mb={2}>
              <Typography variant="h5" color="inherit">
                My Name~~
              </Typography>
            </Box>
            <Box mb={2} style={{flexGrow: 1, textAlign: "center"}}>
              <Typography variant="h5" >
                {rightSideText}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="h5">
                Hi {user.first_name}
              </Typography>
            </Box>
            <div style={{ flexGrow: 1 }}></div>
            <input
              type="file"
              accept="image/*"
              ref={uploadInput}
              style={{ display: 'none' }}
              onChange={handleUploadButtonClicked}
            />
            <Button
              color="inherit"
              onClick={() => uploadInput.current.click()} 
              style={{ border: '1px solid white', marginRight: '10px' }}
            >
              Upload
            </Button>
            <Button
              color="inherit"
              onClick={handleLogoutClick}
              style={{ border: '1px solid white' }}
            >
              Logout
            </Button>
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

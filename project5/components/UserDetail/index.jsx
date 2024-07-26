import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { Typography, Card, CardContent, Button} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
  card:{
    margin: "20px auto",
    padding: "20px"
  },
  info:{
    marginBottom:12
  },
  link: {
    textDecorationLine: "none"
  }
});

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
function UserDetail(){
  const classes = useStyles();
  const {userId} = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = window.cs142models.userModel(userId);
      setUser(userData);
    }
    fetchUserData();
  }, [userId]);

  if (!user){
    return <div>Loading...</div>
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="div">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography color="text.secondary" className={classes.info}>
          Location: {user.location}
        </Typography>
        <Typography variant="body2" className={classes.info}>
          Description: {user.description}
        </Typography>
        <Typography variant="body1" className={classes.info}>
          Occupation: {user.occupation}
        </Typography>
        <Button component={Link} to={`/photos/${userId}`} className={classes.link}>
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}


export default UserDetail;

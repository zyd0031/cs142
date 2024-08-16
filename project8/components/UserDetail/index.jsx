import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { Typography, Card, CardContent, Button, CardMedia, Box} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Link} from "react-router-dom";
import axios from "axios";
import {format} from "date-fns";

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
  const [mostRecentPhoto, setMostRecentPhoto] = useState(null);
  const [mostCommentedPhoto, setMostCommentedPhoto] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      axios.get(`/user/${userId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("failed to fetch user data:", error);
        });
    };

    const fetchMostRecentPhoto = async () => {
      try{
        const response = await axios.get(`/user/${userId}/mostRecentPhoto`);
        if (response.data && response.data._id){
          setMostRecentPhoto(response.data);
        }else{
          setMostRecentPhoto(null);
        }
      } catch (err){
        console.error("Failed to fetch most recent photo: ", err);
      }
    };

    const fetchMostCommentedPhoto = async() => {
      try{
        const res = await axios.get(`/user/${userId}/mostCommentedPhoto`);
        if (res.data && res.data._id){
          setMostCommentedPhoto(res.data);
        }else{
          setMostCommentedPhoto(null);
        }
      } catch (error){
        console.error("Failed to fetch most commented photo: ", error);
      }
    };

    fetchUserData();
    fetchMostRecentPhoto();
    fetchMostCommentedPhoto();
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
        {
          mostRecentPhoto && (
            <>
              <Typography variant="body2" className={classes.info}>
                Most Recent Photo:
              </Typography>
              <Link to={`/photos/${userId}`}>
                <CardMedia component="img" image={`../../images/${mostRecentPhoto.file_name}`} alt="Most Recent Photo" style={{width: "50%", height: "50%"}}/>
              </Link>
              <Typography variant="body2">
                Uploaded on {format(new Date(mostRecentPhoto.date_time), "PPPpp")}
              </Typography>
            </>
          )
        }
        <Box mt={4} />
        {
          mostCommentedPhoto && (
            <>
              <Typography variant="body2" className={classes.info}>
                Most Commented Photo:
              </Typography>
              <Link to={`/photos/${userId}`}>
                <CardMedia component="img" image={`../../images/${mostCommentedPhoto.file_name}`} alt="most Commented Photo" style={{width: "50%", height: "50%"}}/>
              </Link>
              <Typography variant="body2">
                #Comments: {mostCommentedPhoto.comments.length}
              </Typography>
            </>
          )
        }
        <Button component={Link} to={`/photos/${userId}`} className={classes.link}>
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}


export default UserDetail;

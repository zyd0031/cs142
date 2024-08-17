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
  },
  image: {
    width: "50%",
    height: "50%"
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
  const [mentionedPhotos, setMentionedPhotos] = useState([]);

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

    const fetchMentionedPhotos = async() => {
      try{
        const response = await axios.get(`/photos/mention/${userId}`);
        if (response.data && response.data.length > 0){
          setMentionedPhotos(response.data);
        }else{
          setMentionedPhotos([]);
        } 
      } catch (error){
        console.error("Failed to fetch mentioned photos: ", error);
      }
    };

    fetchUserData();
    fetchMostRecentPhoto();
    fetchMostCommentedPhoto();
    fetchMentionedPhotos();
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
              <Typography variant="h6" className={classes.info}>
                Most Recent Photo:
              </Typography>
              <Link to={`/photos/${userId}`}>
                <CardMedia component="img" image={`../../images/${mostRecentPhoto.file_name}`} alt="Most Recent Photo" className={classes.image}/>
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
              <Typography variant="h6" className={classes.info}>
                Most Commented Photo:
              </Typography>
              <Link to={`/photos/${userId}`}>
                <CardMedia component="img" image={`../../images/${mostCommentedPhoto.file_name}`} alt="most Commented Photo" className={classes.image} />
              </Link>
              <Typography variant="body2">
                #Comments: {mostCommentedPhoto.comments.length}
              </Typography>
            </>
          )
        }
        <Box mt={4} />
        {
          mentionedPhotos.length > 0 ? (
            <>
              <Typography variant="h6">Be Mentioned</Typography>
              {mentionedPhotos.map((photo) => (
                <Card key={photo._id}>  
                  <Link to={`/photos/${photo.user_id._id}`}>
                    <CardMedia
                      component="img"
                      image={`../../images/${photo.file_name}`}
                      alt={`Photo by ${photo.user_id.first_name}`}
                      className={classes.image}
                    />
                  </Link>
                  <CardContent>
                    <Typography variant="body2">
                      Photo by:&nbsp;
                      <Link to={`/users/${photo.user_id._id}`}>
                        {`${photo.user_id.first_name} ${photo.user_id.last_name}`}
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Typography variant="body1">
              Not mentioned.
            </Typography>
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

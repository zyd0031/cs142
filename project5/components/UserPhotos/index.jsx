import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Grid, Paper, Card, CardContent, CardMedia } from "@mui/material";
import { format } from "date-fns";
import { makeStyles } from "@mui/styles";
import fetchModel from "../../lib/fetchModelData";


const useStyles = makeStyles({
  root: {
    padding: '16px',  
    maxWidth: 960,
    margin: "auto"
  },
  card: {
    margin: '16px',
    transition: "0.3s",
    "&:hover": {
      transform: "scale(1.03)"
    }
  },
  media: {
    height: 200,
    overflow: "hidden"
  },
  commentSection: {
    backgroundColor: "#f0f0f0",
    padding: '8px',  
    borderRadius: '4px',  
    margin: '8px 0'
  }
});

function UserPhotos() {
  const classes = useStyles();
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async() => {
      try{
        const response = await fetchModel(`/photosOfUser/${userId}`);
        setPhotos(response.data);
      }catch (error){
        console.error("Fail to fetch user photos: ", error);
      }
    };
    if (userId){
      fetchPhotos();
    }
  }, [userId]);

  return (
    <Grid container spacing={2} className={classes.root}>
      {photos.map((photo) => (
        <Grid item xs={12} md={6} key={photo._id}>
          <Card className={classes.card}>
            <CardMedia
              component="img"
              height="200"
              image={`../../images/${photo.file_name}`}  
              alt={`Photo by ${photo.user_id}`}
              className={classes.media}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Uploaded on {photo.date_time ? format(new Date(photo.date_time), "PPPpp") : 'Date unknown'}
              </Typography>
              {(photo.comments || []).map((comment) => (
                <Paper key={comment._id} className={classes.commentSection}>
                  <Typography variant="body2">
                    <Link to={`/users/${comment.user._id}`}>
                      {`${comment.user.first_name} ${comment.user.last_name}`}
                    </Link>
                    {" - "}
                    {comment.date_time ? format(new Date(comment.date_time), "PPPpp") : 'Date unknown'}
                  </Typography>
                  <Typography variant="body1">
                    {comment.comment}
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Grid, Paper, Card, CardContent, CardMedia, Button } from "@mui/material";
import { format } from "date-fns";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { MentionsInput, Mention } from "react-mentions";
import { useHistory } from "react-router-dom";

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
  },
  mentionsInput: {
    width: '100%',
    minHeight: '60px',
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px'
  },
  mentionLink: {
    color: "#3f51b5",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

function UserPhotos() {
  const classes = useStyles();
  const { userId } = useParams();
  const [newComments, setNewComments] = useState({});
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const history = useHistory();

  const fetchPhotos = async() => {
    try{
      const response = await axios.get(`/photosOfUser/${userId}`);
      setPhotos(response.data);
    }catch (error){
      console.error("Fail to fetch user photos: ", error);
    }
  };

  const fetchUsers = async() =>{
    try{
      const response = await axios.get("/user/list");
      const userList = response.data.map(user => ({
        id: user._id,
        display: `${user.first_name} ${user.last_name}`
      }));
      setUsers(userList);
    } catch (error){
      console.error("Error fetching userlist:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchUsers();
  }, [userId]);

  const handleCommentChange = (photoId, comment) => {
    setNewComments(prevComments => ({
      ...prevComments,
      [photoId]: comment
    }));
  };

  const handleCommentSubmit = async (photoId) => {
    const comment = newComments[photoId];
    if (!comment || comment.trim() === ""){
      return;
    }
    try{
      await axios.post(`/commentsOfPhoto/${photoId}`, {comment});
      setNewComments(prevComments => ({
        ...prevComments,
        [photoId]: ""
      }));
      fetchPhotos();
    }catch(error){
      console.error("Failed to add comment: ", error);
    }
  };

  const renderCommentWithMentions = (commentText) => {
    const mentionPattern = /@(\w+\s\w+)/g;
    const parts = commentText.split(mentionPattern);

    return parts.map((part, index) => {
      const user = users.find(user => `${user.display}` === part);
      if (user) {
        return (
          <Link key={index} to={`/users/${user.id}`} className={classes.mentionLink}>
            @{user.display}
          </Link>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      {photos.map((photo) => (
        <Grid item xs={12} md={6} key={photo._id}>
          <Card className={classes.card}>
            <CardMedia
              component="img"
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
                    {renderCommentWithMentions(comment.comment)}
                  </Typography>
                </Paper>
              ))}
              <MentionsInput 
                value={newComments[photo._id] || ""} 
                onChange={(e) => handleCommentChange(photo._id, e.target.value)} 
                className={classes.mentionsInput} 
                placeholder="Add a comment...">
                  <Mention 
                    trigger="@" 
                    data={photo.shared_with.map(user => ({id: user._id, display: `${user.first_name} ${user.last_name}`}))}  
                    displayTransform={(id, display) => `@${display}`}
                    markup="@__display__"
                  />
              </MentionsInput>
              <Button
                onClick={() => handleCommentSubmit(photo._id)}
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;


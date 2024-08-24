import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, CardMedia, Button, Box, Modal} from "@mui/material";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { format } from "date-fns"
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    card: {
      margin: '16px',
      transition: "0.3s",
      "&:hover": {
        transform: "scale(1.03)"
      }
    },
    modalContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        boxShadow: 24,
        padding: '16px',
        borderRadius: '8px',
        outline: 'none'
    }
  });

function Favorites() {
    const [favoritePhotos, setFavoritePhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const classes = useStyles();
    const history = useHistory();

    const fetchFavoritePhotos = async () => {
        try{
            const response = await axios.get("/photos/liked");
            setFavoritePhotos(response.data);
        } catch (error) {
            console.error("Failed to fetch favorite photos: ", error);
        }
    };

    useEffect (() => {
        fetchFavoritePhotos();
    });

    const handleRemoveFavorite = async (photoId) => {
        try{
            await axios.post(`/photos/${photoId}/unlike`);
            fetchFavoritePhotos();
        } catch (error){
            console.error("Failed to remove photo from favorites: ", error);
        }
    };

    const handleThumbnailClicked = (photo) => {
        setSelectedPhoto(photo);
    };

    const handleCloseModel = (photo) => {
        setSelectedPhoto(null);
    };

    const handleViewPhoto = (userId) => {
        history.push(`/photos/${userId}`);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                My Favorite Photos
            </Typography>
            {favoritePhotos.length > 0 ? (
                <Grid container spacing={3}>
                    {favoritePhotos.map((photo) => (
                        <Grid item xs={12} sm={6} md={4} key={photo._id}>
                            <Card className={classes.card}>
                                <CardMedia
                                    component="img"
                                    image={`../../images/${photo.file_name}`}  
                                    alt={`Photo by ${photo.user_id}`}
                                    className={classes.media}
                                    onClick={() => handleThumbnailClicked(photo)}
                                />
                                <CardContent>
                                    <Button 
                                        onClick={() => handleRemoveFavorite(photo._id)} 
                                        color="secondary" 
                                        variant="contained"
                                    >
                                        Unlike
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h5" align="center" color="textSecondary">
                    You have no favorite photos.
                </Typography>
            )}
            <Modal
                open={!!selectedPhoto}
                onClose={handleCloseModel}
            >
                <Box className={classes.modalContent}>
                    {
                        selectedPhoto && (
                            <Card>
                                <CardMedia
                                component="img"
                                image={`../../images/${selectedPhoto.file_name}`}
                                alt={`Photo by ${selectedPhoto.user_id}`}
                                />
                                <CardContent>
                                    <Typography>
                                        Uploaded on {format(new Date(selectedPhoto.date_time), "PPPpp")}
                                    </Typography>
                                    <Box mt={2}>
                                        <Button onClick={() => handleViewPhoto(selectedPhoto.user_id)} color="primary" variant="contained">
                                        View Photo
                                        </Button>
                                    </Box>
                                </CardContent>
                          </Card>
                        )
                    }
                </Box>

            </Modal>
        </div>
    );
    
}

export default Favorites;
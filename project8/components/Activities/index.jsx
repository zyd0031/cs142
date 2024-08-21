import React, { useEffect, useState} from "react";
import axios from "axios";
import { Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Activities = () => {
    const [activities, setActivities] = useState([]);

    const fetchActivities = async() => {
        try{
            const response = await axios.get("/activities");
            setActivities(response.data);
        } catch (error){
            console.error("Failed to fetch activities: ", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <div>
            <Typography variant="h4">Recent Activities</Typography>
            <List>
                {
                    activities.map(activity => {
                        let primaryText = (
                            <>
                                <Link to={`/users/${activity.user_id._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {activity.user_id.full_name}
                                </Link>
                                {activity.activity_type === "Photo Upload" && " uploaded a photo"}
                                {activity.activity_type === "New Comment" && " posted a comment"}
                                {activity.activity_type === "User Register" && " registered"}
                                {activity.activity_type === "User Login" && " logged in"}
                                {activity.activity_type === "User Logout" && " logged out"}
                            </>
                        );

                        return (
                            <ListItem key={activity._id}>
                                <ListItemAvatar>
                                    {(activity.activity_type === "Photo Upload" || activity.activity_type === "New Comment") && (
                                            <Link to={`/photos/${activity.photo_id.user_id}`}>
                                                <Avatar variant="square" src={`../../images/${activity.photo_id.file_name}`} />
                                            </Link>
                                    )}
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={primaryText}
                                    secondary={format(new Date(activity.date_time), "PPPpp")}
                                />
                                {activity.activity_type === "New Comment" && (
                                    <Typography variant="body2">
                                        {activity.comment_text}
                                    </Typography>
                                )}
                            </ListItem>
                        );
                    })
                }
            </List>
            <Button onClick={fetchActivities} variant="contained" color="primary">
                Refresh
            </Button>
        </div>
    );
}

export default Activities;

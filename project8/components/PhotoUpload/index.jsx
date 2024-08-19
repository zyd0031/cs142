import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {Button, Checkbox, FormControlLabel, Typography} from "@mui/material";

const PhotoUpload = ({user}) => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([user._id]);
    const uploadInput = useRef(null);
    const history = useHistory();

    const fetchUsers = async() => {
        try{
          const response = await axios.get("/user/list");
          if (response.data && response.data.length > 0){
            const filteredUsers = response.data.filter(u => u._id !== user._id);
            setUsers(filteredUsers);
          }else{
            setUsers([]);
          }
        } catch (error){
          console.error("Error fetching user list: ", error)
        }
      };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleUploadButtonClicked = async (e) => {
        e.preventDefault();
        if (uploadInput.current.files.length > 0){
            const domForm = new FormData();
            domForm.append("uploadedphoto", uploadInput.current.files[0]);
            domForm.append("share_with", JSON.stringify(selectedUsers));
            try{
                await axios.post("/photos/new", domForm);
                alert("Photo uploading successfully!");
                history.push(`/photos/${user._id}`);
            } catch (error){
                console.error("Photo uploading error: ", error);
                alert("Failed to upload photo.");
            }
        }
    };

    return (
        <div>
            <Typography variant="h4">Upload a Photo</Typography>
            <input type="file" accept="image/*" ref={uploadInput} />
            <div>
                <Typography variant="h6">Share with:</Typography>
                {
                    users.map((user) => (
                        <FormControlLabel 
                            key={user._id}
                            control={<Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleCheckboxChange(user._id)} />}
                            label={`${user.first_name} ${user.last_name}`} />
                    ))
                }
            </div>
            <Button color="primary" variant="contained" onClick={handleUploadButtonClicked}>
                Upload
            </Button>
        </div>
    )
};

export default PhotoUpload;
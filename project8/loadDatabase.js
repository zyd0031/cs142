/**
 * This Node.js program loads the CS142 Project 7 model data into Mongoose
 * defined objects in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * Be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'cs142project6'.
 * In loads into collections named User and Photos. The Comments are added in
 * the Photos of the comments. Any previous objects in those collections are
 * discarded.
 */

// We use the Mongoose to define the schema stored in MongoDB.
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the magic models we used in the previous projects.
const cs142models = require("./modelData/photoApp.js").cs142models;

// Load the Mongoose schema for Use and Photo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
const cs142password = require("./cs142password");
const Activity = require("./schema/activity.js");
const ActivityTypes = require("./schema/activityTypes.js");
const versionString = "1.0";

// We start by removing anything that existing in the collections.
const removePromises = [
  User.deleteMany({}),
  Photo.deleteMany({}),
  SchemaInfo.deleteMany({}),
  Activity.deleteMany({})
];

Promise.all(removePromises)
  .then(function () {
    // Load the users into the User. Mongo assigns ids to objects so we record
    // the assigned '_id' back into the cs142model.userListModels so we have it
    // later in the script.

    const userModels = cs142models.userListModel();
    const mapFakeId2RealId = {};
    const userPromises = userModels.map(function (user) {
      const passwordEntry = cs142password.makePasswordEntry("weak");
      return User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        login_name: user.last_name.toLowerCase(),
        salt: passwordEntry.salt,
        password_digest: passwordEntry.password_digest
      })
        .then(function (userObj) {
          // Set the unique ID of the object. We use the MongoDB generated _id
          // for now but we keep it distinct from the MongoDB ID so we can go to
          // something prettier in the future since these show up in URLs, etc.
          userObj.save();
          mapFakeId2RealId[user._id] = userObj._id;
          user.objectID = userObj._id;
          console.log(
            "Adding user:",
            user.first_name + " " + user.last_name,
            " with ID ",
            user.objectID
          );
        })
        .catch(function (err) {
          console.error("Error create user", err);
        });
    });

    const allPromises = Promise.all(userPromises).then(function () {
      // Once we've loaded all the users into the User collection we add all the
      // photos. Note that the user_id of the photo is the MongoDB assigned id
      // in the User object.
      const photoModels = [];
      const userIDs = Object.keys(mapFakeId2RealId);
      const realUserIDs = Object.values(mapFakeId2RealId);
      userIDs.forEach(function (id) {
        photoModels.push(...cs142models.photoOfUserModel(id));
      });

      const photoPromises = photoModels.map(function (photo) {
        return Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: mapFakeId2RealId[photo.user_id],
          shared_with: realUserIDs
        })
          .then(async function (photoObj) {
            photo.objectID = photoObj._id;

            const newPhotoActivity = new Activity({
              activity_type: ActivityTypes.PHOTO_UPLOAD,
              user_id: photoObj.user_id,
              photo_id: photoObj._id,
              date_time: photoObj.date_time
            });

            await newPhotoActivity.save();

            if (photo.comments) {
              for (const comment of photo.comments) {
                const newComment = {
                  comment: comment.comment,
                  date_time: comment.date_time,
                  user_id: comment.user.objectID,
                };
        
                photoObj.comments.push(newComment);
                await photoObj.save();
        
                const savedComment = photoObj.comments[photoObj.comments.length - 1];
        
                const newCommentActivity = new Activity({
                  activity_type: ActivityTypes.NEW_COMMENT,
                  user_id: comment.user.objectID,
                  photo_id: photoObj._id,
                  comment_id: savedComment._id, 
                  date_time: savedComment.date_time
                });
        
                await newCommentActivity.save();
        
                console.log(
                  "Adding comment of length %d by user %s to photo %s",
                  comment.comment.length,
                  comment.user.objectID,
                  photo.file_name
                );
              }
            }
            console.log(
              "Adding photo:",
              photo.file_name,
              " of user ID ",
              photoObj.user_id
            );
          })
          .catch(function (err) {
            console.error("Error create user", err);
          });
      });
      return Promise.all(photoPromises).then(function () {
        // Create the SchemaInfo object
        return SchemaInfo.create({
          version: versionString,
        })
          .then(function (schemaInfo) {
            console.log(
              "SchemaInfo object created with version ",
              schemaInfo.version
            );
          })
          .catch(function (err) {
            console.error("Error create schemaInfo", err);
          });
      });
    });

    allPromises.then(function () {
      mongoose.disconnect();
    });
  })
  .catch(function (err) {
    console.error("Error create schemaInfo", err);
  });

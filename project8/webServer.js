/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const cs142password = require("./cs142password");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
// const cs142models = require("./modelData/photoApp.js").cs142models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

function isAuthenticated(req, res, next){
  if (req.session && req.session.user){
    next();
  }else {
      res.status(401).send("Unauthorized: You need to login first!");
  }
}

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", isAuthenticated, function (request, response) {

  User.find({}, "_id first_name last_name")
    .then(users => response.json(users))
    .catch(err =>{
      console.error("Error fetching users", err);
      response.status(500).send("Failed to fetch users");
    });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", isAuthenticated, function (request, response) {

  const id = request.params.id;
  User.findById(id, "_id first_name last_name location description occupation")
    .then(user => {
      if (!user){
        console.log("User with _id:" + id + " not found.");
        response.status(400).send("User not found");
        return;
      }
      response.json(user);
    })
    .catch(err => {
      console.error("Error fetching user details", err);
      response.status(400).send("Failed to fetch user details");
    });
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", isAuthenticated, function (request, response) {
  const userId = request.params.id;

  Photo.find({user_id: userId}, "-__v")
      .then(photos => {
          if (photos.length === 0) {
              console.log("Photos for user with _id:" + userId + " not found.");
              response.status(404).send("Photos not found");
              return;
          }

          const photosPromises = photos.map(photo => {
              const commentsPromises = photo.comments.map(comment => {
                  return User.findById(comment.user_id, '_id first_name last_name')
                      .then(user => {
                          const modifiedComment = { ...comment._doc, user: user };
                          delete modifiedComment.user_id;
                          return modifiedComment;
                      })
                      .catch(err => {
                          console.error("Error fetching user for comment", err);
                          throw new Error("Failed to fetch user for comment");
                      });
              });

              return Promise.all(commentsPromises)
                  .then(comments => {
                      return {...photo._doc, comments: comments}; 
                  });
          });

          return Promise.all(photosPromises);
      })
      .then(completePhotos => {
          response.json(completePhotos);
      })
      .catch(err => {
          console.error("Error processing photos", err);
          response.status(500).send("Failed to process photos");
      });
});

/**
 * URL - /admin/login - Provides a way for the photo app's LoginRegister view to login in a user.
 */
app.post("/admin/login", async (req, res) => {
  const {login_name, password} = req.body;
  try{
    const user = await User.findOne({login_name: login_name});
    if (!user){
      return res.status(400).json({message: "Invalid login name"});
    }

    if (!cs142password.doesPasswordMatch(user.password_digest, user.salt, password)) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    req.session.user = user;
    res.send({_id: user._id, first_name: user.first_name});
  } catch (err){
    console.error("login error: ", err);
    res.status(500).json({message: "Internal server error"});
  }
});

/**
 * URL - /admin/logout - A POST request with an empty body to this URL will logout the user by clearing the information stored in the session.
 */
app.post("/admin/logout", (req, res) => {
  if (!req.session.user){
    return res.status(400).send("No user is currently logged in");
  }
  req.session.destroy((err) => {
    if (err){
      return res.status(500).send("Internal server error");
    }
    res.status(200).send("Logout successfully");
  });
});

/**
 * URL /user - Allows a user to register. T
 */
app.post("/user", async (req, res) => {
  const {login_name, password, first_name, last_name, location, description, occupation} = req.body;
  if (!login_name || !password || !first_name || !last_name){
    return res.status(400).json({message: "Required field missing"});
  }

  try{
    const existingUser = await User.findOne({login_name});
    if (existingUser){
      return res.status(400).send({message: "Login name already exists"});
    }

    const { salt, password_digest } = cs142password.makePasswordEntry(password);

    const newUser = new User({
      login_name,
      salt,         
      password_digest,         
      first_name,
      last_name,
      location,
      description,
      occupation
    });

    await newUser.save();
    res.send({login_name: newUser.login_name});
  } catch (err){
    console.log(err);
    res.status(500).send({message: "Internal server error"});
  }
});

/**
 * URL - /commentsOfPhoto/:photo_id - Add a comment to the photo whose id is photo_id
 */
app.post("/commentsOfPhoto/:photo_id", isAuthenticated, async (req, res) => {
  const photoId = req.params.photo_id;
  const {comment} = req.body;

  if (!comment || comment.trim() === ""){
    return res.status(400).send("Bad request: Comment cannot be empty");
  }

  try{
    const photo = await Photo.findById(photoId);
    if (!photo){
      return res.status(404).send("Photo not found");
    }

    const userId = req.session.user._id;

    const mentionPattern = /@(\w+\s\w+)/g;
    const mentionedUsers = [];
    let match;
    while ((match = mentionPattern.exec(comment)) !== null) {
      const fullName = match[1];
      const [first_name, last_name] = fullName.split(" ");
      const mentionedUser = await User.findOne({ first_name, last_name });
      if (mentionedUser) {
        mentionedUsers.push(mentionedUser._id);
      }
    }

    const newComment = {
      comment,
      date_time: new Date(),
      user_id: userId,
      mentions: mentionedUsers  
    };

    photo.comments.push(newComment);
    await photo.save();

    res.status(200).send(photo);
  } catch (error){
    res.status(500).send("Internal server error");
  }
});

/**
 * URL - /photos/new - Upload a photo for the current user. 
 */
app.post("/photos/new", isAuthenticated, (request, response) => {
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      return response.status(400).send("No file uploaded");
    }

    const timestamp = new Date().valueOf();
    const filename = 'U' + String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, async function (err) {
      if (err) {
        return response.status(500).send("Failed to save photo");
      }

      try {
        const userId = request.session.user._id;
        const newPhoto = new Photo({
          file_name: filename,
          date_time: new Date(),
          user_id: userId,
          comments: []
        });

        await newPhoto.save();
        response.status(200).send(newPhoto);
      } catch (err) {
        console.error("Error uploading photo", err);
        response.status(500).send("Internal server error");
      }
    });
  });
});

/**
 * get the most recent uploaded photo of a user
 */
app.get("/user/:id/mostRecentPhoto", isAuthenticated, function(req, res){
  const userId = req.params.id;

  Photo.find({user_id: userId})
    .sort({date_time: -1})
    .limit(1)
    .then(photos =>{
      if (photos.length === 0){
        return res.json({});
      }
      res.json(photos[0]);
    })
    .catch(err => {
      console.error("Error fetching most recent photo: ", err);
      res.status(500).send("Internal server error");
    })
});

/**
 * get the most commented photo of a user
 */
app.get("/user/:id/mostCommentedPhoto", isAuthenticated, function(req, res){
  const userId = req.params.id;

  Photo.find({user_id: userId})
    .sort({"comments.length": -1})
    .limit(1)
    .then(photos =>{
      if (photos.length === 0){
        return res.json({});
      }
      res.json(photos[0]);
    })
    .catch(err => {
      console.error("Error fetching most commented photo: ", err);
      res.status(500).send("Internal server error");
    });
});


const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

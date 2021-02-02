const functions = require("firebase-functions");
// const admin = require('firebase-admin'); --moved to admin.js
// const express = require('express');
// const app = express();
const app = require('express')(); // condensed 

const FBAuth = require('./util/fbAuth');

const { 
    getAllScreams, 
    postOneScream, 
    getScream, 
    commentOnScream,
    likeScream,
    unlikeScream, 
    deleteScream,
    } = require('./handlers/screams');
const { 
    signup, 
    login, 
    uploadImage, 
    getUserDetails,
    addUserDetails, 
    getAuthenticatedUser 
} = require('./handlers/users');
// admin.initializeApp(); --moved to admin.js 

// DEPRECATED --> moved to config.js 
// const firebaseConfig = { 
//   apiKey: "AIzaSyA5gt8WTaenXhqFyTHFf0EZ1O5OQGYvbYw",
//   authDomain: "socialape-af2eb.firebaseapp.com",
//   databaseURL: "https://socialape-af2eb-default-rtdb.firebaseio.com",
//   projectId: "socialape-af2eb",
//   storageBucket: "socialape-af2eb.appspot.com",
//   messagingSenderId: "324358641073",
//   appId: "1:324358641073:web:1d9b2206d0bc3dd0001990",
//   measurementId: "G-G0K6KWBT91"
// };

// const firebase = require('firebase');
// firebase.initializeApp(firebaseConfig);

// const db = admin.firestore(); --moved to admin.js

// Scream Routes
app.get('/screams', getAllScreams);
// postOneScream: Second arg in the post will be the middleware. It intercepts the req  
// and performs an operation depending on the body of the req. Then it 
// decides whether to proceed toward the handler or send back a res
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream); // colon preceding the term indicates to app that it is a route parameter
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream); // colon preceding the term indicates to app that it is a route parameter
app.get('/scream/:screamId/like', FBAuth, unlikeScream); // colon preceding the term indicates to app that it is a route parameter
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);


// CLIENT ROUTES
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage); // FBAuth to ensure not just anyone is uploading an img to backend storage
app.post('/user/', FBAuth, addUserDetails);
app.get('/user/:handle', getUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello Social Apes!");
// });


exports.api = functions.https.onRequest(app);


// // Fetch posts from database collection on Firebase ---replaced w/ Express fxn
// exports.getScreams = functions.https.onRequest((req, res) => {
//   admin
//   .firestore()
//   .collection('screams')
//   .get()
//     .then(data => {
//       let screams = [];
//       data.forEach(doc => {
//         screams.push(doc.data());
//       });
//       return res.json(screams);      
//     }) 
//     .catch(err => console.error(err));
// })

// exports.createScream = functions.https.onRequest((req, res) => {
//   // Ensure that we don't send a get req for a route that's meant for a post req
//   if(req.method !== 'POST') { // Express will take care of this check
//     return res.status(400).json({ error: 'Method not allowed' }); //400 --> client error
//   }
//   const newScream = {
//     body: req.body.body,
//     userHandle: req.body.userHandle,
//     createdAt: db.Timestamp.fromDate(new Date())
//   };

//   db()
//     .collection('screams')
//     .add(newScream)
//     .then(doc => {
//       res.json({ message: `document ${doc.id} created successfully`});
//     })
//     .catch(err => {
//       res.status(500).json({ error: 'something went wrong'}); // 500 --> internal server error
//       console.log(err);
//     });
// });


// BAD PRACTICE --> http://baseurl.com/scream, GOOD PRACTICE --> http://baseurl.com/api/
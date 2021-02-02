
const {admin, db} = require('../util/admin');

const fbConfig = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(fbConfig);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validator');

// Sign up user
exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email, 
      password: req.body.password, 
      confirmPassword: req.body.confirmPassword, 
      handle: req.body.handle, 
    };
  
    const { valid, errors } = validateSignupData(newUser);//destructuring 

    if(!valid) return res.status(400).json(errors);
  
    // assign no-img.png if image file is not uploaded
    const noImg = 'batman_lego.png';


    let token, userId;
    // Ensure unique user handle (email)
    db.doc(`/users/${newUser.handle}`).get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'this handle is already taken'});
      } else {
        return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        // If we reach here, that means the user has been created
        // Return an authentication token so that the user can request more data
        userId = data.user.uid;
        return data.user.getIdToken(); //returning a promise 
      })
      .then((idToken) => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${fbConfig.storageBucket}/o/${noImg}?alt=media`,
          userId
        };
        return db.doc(`/users/${ newUser.handle }`).set(userCredentials);
        // return res.status(201).json({ token });
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already in use'});
        } else {
          // return res.status(500).json({ error: err.code });
          return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
        }
      });
    // DEPRECATED -- replaced with handle validation block above
    // firebase.auth()
    // .createUserWithEmailAndPassword(newUser.email, newUser.password)
    //   .then(data => {
    //     return res.status(201).json({ message: `user ${data.user.uid} signed up successfully`});
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     return res.status(500).json();
    //   });
  };

  // Login user in 
  exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);//destructuring 

    if(!valid) return res.status(400).json(errors);
  

    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user.getIdToken();
      })
      .then((token) => {
        return res.json({token});
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/wrong-password') {
          return res.status(403).json({ general: 'Wrong credentials, please try again'}); 
        } else return res.status(500).json( {error: err.code });
      });
    };

    // Add user details 
    exports.addUserDetails = (req, res ) => {
      let userDetails = reduceUserDetails(req.body);

      // look for user document 
      db.doc(`/users/${req.user.handle}`)
      .update(userDetails)
        .then(() => {
          return res.json({ message: 'Details added successfully'});
        })
        .catch(err => {
          return res.status(500).json({error: err.code});
        });
    };

    exports.getUserDetails = (req, res) => {
      let userData = {};
      db.doc(`/users/${req.params.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return db
            .collection("screams")
            .where("userHandle", "==", req.params.handle)
            .orderBy("createdAt", "desc")
            .get();
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      }) 
      .then((data) => {
        userData.screams = [];
        data.forEach((doc) => {
          userData.screams.push({
            body: doc.data().body,
            createdAt: doc.data().createdAt,
            userHandle:doc.data().userHandle,
            userImage: doc.data().userImage,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            screamId: doc.id,
          });
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
    };

    // Get own user details 
    exports.getAuthenticatedUser = (req, res) => {
      let userData = {}; // append data to this as we go down the promise chain
      db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
          if (doc.exists) {
            userData.credentials = doc.data();
            // retrieve the likes of the user 
            return db.collection('likes')
              .where('userHandle', '==', req.user.handle)
              .get();
          } 
        })
        .then((data) => {
          userData.likes = [];
          data.forEach(doc => {
            userData.likes.push(doc.data());
          });
          return res.json(userData);
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    };

    // Upload user profile image
    exports.uploadImage = (req, res) => {
      const BusBoy = require('busboy');
      const path = require('path');
      const os = require('os');
      const fs = require('fs');

      // create instance of busboy
      // '.headers' is the read-only property containing the headers obj
      const busboy = new BusBoy({ headers: req.headers }); //takes an options object

      let imageFileName;
      let imageToBeUploaded = {};

      // if (typeof(imageFileName) == 'undefined') { // DEBUGGING 
      //   return res.status(404).json({ body: 'imageFileName has not been defined in this scope.'});
      // } else {
      //   return res.status(200).json({ body: 'imageFileName has been defined in this scope.'});
      // }

    
      // 'file' is the event name 
      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        // Check that file uploaded is an image 
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
          return res.status(400).json({ error: 'Wrong file type submitted' });
        }

        console.log(fieldname, filename, mimetype);

        // Ex. "my.image.png" --> need to split string
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        
        
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName); //concatenate img and file dir
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath)); // create a file via filepath

      });

      // upload file that's been created 
      busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,

            },
          },
        })
        .then(() => {
          // construct image url to be added to user
          // NOTE: 'alt:media' allows the image to be shown on the browser instead of just downloading the file to our computer
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${fbConfig.storageBucket}/o/${imageFileName}?alt=media`; // url retrieved from config.js
          
          // Add imageUrl to our user document on FB 
          // If we've reached this line, that indicates that we have the user obj since it's been authenticated 
          return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: "Image could not be uploaded."});
        });
      });
      busboy.end(req.rawBody); // 'rawBody' is a property inherent to every req obj
    };
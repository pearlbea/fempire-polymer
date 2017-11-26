const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Twitter = require("twitter");

require("dotenv").config();

admin.initializeApp(functions.config().firebase);

const client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  bearer_token: process.env.TWITTER_TOKEN
});

exports.getTwitterImage = functions.database
  .ref("/directory/{pushId}/twitter_handle")
  .onWrite(event => {
    const screen_name = event.data.val();
    const path = event.data.ref.parent;
    client.get("users/show", { screen_name: screen_name }).then(data => {
      return path.child("twitter_image_url").set(data.profile_image_url_https);
    });
  });

exports.addTwitterHandle = functions.https.onRequest((req, res) => {
  const twitter_handle = req.query.twitter;
  admin
    .database()
    .ref("/directory")
    .push({ twitter_handle: twitter_handle })
    .then(snapshot => {
      res.redirect(303, snapshot.ref);
    });
});

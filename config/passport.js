const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");
// Load user model
const User = mongoose.model("users");

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        // In the documentation must give passport the information from googleAPI
        clientID: keys.googleClientID,
        clientSecret: keys.googleClient_Secret,
        callbackURL: "/auth/google/callback",
        proxy: true
      }, // Upon success we want to log this in mongoose
      (accessToken, refreshToken, profile, done) => {
        // We have to use substring to remove the query ?sz=50 after the jpg
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf("?")
        );
        console.log(image);

        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: image
        };

        // Check for existing user
        User.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};

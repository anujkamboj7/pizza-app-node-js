const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../http/models/user");

function facebookInit(passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: [
          "id",
          "displayName",
          "first_name",
          "last_name",
          "gender",
          "emails",
        ],
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne(
          {
            facebookId: profile.id,
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              console.log("user found");
              console.log(user);
              return done(null, user);
            } else {
              var newUser = new User();
              newUser.facebookId = profile.id;
              newUser.displayName = profile.displayName;
              newUser.name.firstname = profile.name.givenName;
              newUser.name.lastname = profile.name.familyName;
              newUser.name.middlename = profile.name.middleName;
              newUser.gender = profile.gender;
              newUser.email = profile.emails[0].value;

              //   save our user to the database
              newUser.save(function (err) {
                if (err) {
                  console.log(profile);
                  throw err;
                }
                // if successful , return the new user
                return done(null, newUser);
              });
            }
          }
        );
        console.log(profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = facebookInit;

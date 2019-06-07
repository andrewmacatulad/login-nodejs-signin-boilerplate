const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const TwitterStrategy = require("passport-twitter").Strategy;
// const TwitchStrategy = require("passport-twitch").Strategy;
// const InstagramStrategy = require("passport-instagram").Strategy;
// const mongoose = require("mongoose");
// const User = mongoose.model("users");

const keys = require("../config/keys");

// passport.serializeUser((user, done) => {
//   // the user.id is the id in the mongo
//   done(null, user.id);
// });

// // the id pass here is the cookie use in the serializeUser
// // in this case the userId
// passport.deserializeUser((id, done) => {
//   User.findById(id).then(user => {
//     done(null, user);
//   });
// });
const User = require("../models/userModel");
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    done(null, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
      console.log("Email ", email);
      // asynchronous
      process.nextTick(async function() {
        const schema = Joi.object().keys({
          email: Joi.string()
            .email({ minDomainAtoms: 2 })
            .required(),
          password: Joi.string()
            // Not less than 3 characters not greater than 30
            .regex(/^[a-zA-Z0-9]{3,30}$/)
            .required()
        });

        Joi.validate({ email, password }, schema, async (err, value) => {
          if (err) {
            return done(null, false, {
              message: err.details[0].message
            });
          } else {
            const pwd = await bcrypt.hash(password, 5);
            try {
              const result = await User.findOne({ where: { email } });
              // console.log(result);
              console.log(result !== null);
              if (result !== null) {
                return done(null, false, {
                  message: "Email is in use"
                });
              }
            } catch (err) {
              done(err);
            }

            User.create({
              email,
              password: pwd,
              name: req.body.name
            })
              .then(result => done(null, result))
              .catch(err => done(err));
          }
        });
      });
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function(email, password, done) {
      try {
        const result = await User.findOne({ where: { email } });
        // console.log(result);
        console.log(result !== null);
        if (result === null) {
          return done(null, false, {
            message: `Email or Password isn't correct`
          });
        }
        // console.log(bcrypt.compare(password, result.dataValues.password));

        bcrypt.compare(password, result.dataValues.password, function(
          err,
          check
        ) {
          if (err) {
            console.log("Error while checking password");
            return done(null, false, {
              message: "Invalid email or password"
            });
          } else if (check) {
            // return done(null, [
            //   {
            //     email: result.rows[0].email,
            //     firstName: result.rows[0].firstName
            //   }
            // ]);
            return done(null, result);
          } else {
            // req.flash("danger", "Oops. Incorrect login details.");
            return done(null, false, {
              message: "Invalid email or password"
            });
            // return done(null, false);
          }
        });

        // return done(null, result);
      } catch (err) {
        // done(null, false, {
        //   message: err
        // });
        done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (!req.user) {
        let existingUser;
        try {
          existingUser = await User.findOne({
            where: { email: profile.emails[0].value }
          });
          // console.log(existingUser);
        } catch (error) {
          return done(error);
        }

        if (existingUser) {
          return done(null, existingUser);
        }

        try {
          const data = {
            email: profile.emails[0].value,
            name: profile.displayName
          };
          User.create(data).then(function(newUser, created) {
            if (!newUser) {
              return done(null, false);
            }

            if (newUser) {
              return done(null, newUser);
            }
          });

          // const user = await new User({
          //   username: profile.emails[0].value,
          //   name: profile.displayName
          // }).save();
          // done(null, user);
        } catch (error) {
          console.dir(error.message, { colors: true });
        }
      }
    }
  )
);

// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: keys.twitterClientID,
//       consumerSecret: keys.twitterClientSecret,
//       callbackURL: "/auth/twitter/callback",
//       includeEmail: true,
//       proxy: true
//     },
//     async (token, tokenSecret, profile, done) => {
//       console.log(profile);
//       const existingUser = await User.findOne({
//         twitterId: profile.id
//       });
//       console.log(existingUser);
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       const user = await new User({
//         email: profile.emails[0].value,
//         name: profile._json.screen_name,
//         twitterId: profile.id
//         // twitterAuth: { token, tokenSecret }
//       }).save();
//       console.log("Saved User Twitter Account");
//       done(null, user);
//     }
//   )
// );

// passport.use(
//   new TwitchStrategy(
//     {
//       clientID: keys.twitchClientID,
//       clientSecret: keys.twitchClientSecret,
//       callbackURL: "/auth/twitch/callback",
//       scope: "user_read",
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       const existingUser = await User.findOne({
//         twitchId: profile.id
//       });
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       const user = await new User({
//         twitchId: profile.id,
//         name: profile.displayName,
//         email: profile.email
//       }).save();
//       done(null, user);
//     }
//   )
// );

// passport.use(
//   new InstagramStrategy(
//     {
//       clientID: keys.instagramClientID,
//       clientSecret: keys.instagramClientSecret,
//       callbackURL: "/auth/instagram/callback",
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       const existingUser = await User.findOne({
//         instagramId: profile.id
//       });
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       const user = await new User({
//         instagramId: profile.id,
//         name: profile.displayName,
//         email: profile.email
//       }).save();
//       done(null, user);
//     }
//   )
// );

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: keys.githubClientID,
//       clientSecret: keys.githubClientSecret,
//       callbackURL: "http://localhost:5000/auth/github/callback",
//       scope: ["user:email"]
//     },
//     async (req, token, refreshToken, profile, done) => {
//       console.log(profile);
//       // check if the user is already logged in
//       const existingUser = await User.findOne({ githubId: profile.id });

//       // if the user is found
//       if (existingUser) {
//         console.log("Github user is already registered");
//         return done(err);
//       }
//       // user already exists and is logged in, we have to link accounts
//       // var user = req.user; // pull the user out of the session
//       // // update the current users facebook credentials
//       // user.githubId = profile.id;
//       // user.name = profile.displayName;
//       // user.email = profile._json.email;

//       const user = await new User({
//         githubId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value
//       }).save();
//       done(null, user);
//       // save the user
//     }
//   )
// );

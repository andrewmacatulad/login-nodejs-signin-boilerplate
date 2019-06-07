const passport = require("passport");

exports.signup = function(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate("local-signup", function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
      // return res.json({ success: false, message: info.message })
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    // Passport exposes a login() function on req (also aliased as logIn())
    // that can be used to establish a login session
    req.logIn(user, loginErr => {
      if (loginErr) {
        return res.json({ success: false, message: loginErr });
      }
      return res.json(req.user);
    });
  })(req, res, next);
};

exports.login = function(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate("local-login", function(err, user, info) {
    // console.log(user);
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
      // return res.json({ success: false, message: info.message })
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    // Passport exposes a login() function on req (also aliased as logIn())
    // that can be used to establish a login session
    req.logIn(user, loginErr => {
      // console.log(loginErr);
      if (loginErr) {
        return res.json({ success: false, message: loginErr });
      }
      return res.json(req.user);
    });
  })(req, res, next);
};

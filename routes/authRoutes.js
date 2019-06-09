const passport = require("passport");
module.exports = app => {
  // Social Media Login
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "http://localhost:3000/login"
    })

    // (req, res) => {
    //   res.redirect("http://localhost:3000");
    // }
  );

  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  app.get(
    "/auth/twitch",
    passport.authenticate("twitch", { forceVerify: true })
  );

  app.get(
    "/auth/twitch/callback",
    passport.authenticate("twitch", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  app.get("/auth/instagram", passport.authenticate("instagram"));

  app.get(
    "/auth/instagram/callback",
    passport.authenticate("instagram", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  app.get("/auth/github", passport.authenticate("github"));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  app.get("/api/logout", (req, res) => {
    req.session.destroy();
    req.logout();
    // req.session = null;

    res.redirect("http://localhost:3000/");
    // res.send("logout");
    // req.session.destroy(function(err) {
    //   res.clearCookie("connect.sid");
    //   console.log("Authenticated " + req.isAuthenticated());
    //   res.redirect("/");
    // });

    // if (req.session) {
    //   req.session = null;
    //   // Delete Session
    //   // req.session.destroy(function(err) {
    //   //   if (err) {
    //   //     return next(err);
    //   //   } else {

    //   //     return res.redirect("/");
    //   //   }
    //   // });
    // }
  });
};

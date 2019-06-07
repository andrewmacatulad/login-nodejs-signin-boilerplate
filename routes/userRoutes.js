// const bcrypt = require("bcrypt");
// const LocalStrategy = require("passport-local").Strategy;
// const User = require("../models/userModel");

const Authentication = require("../controller/auth");

module.exports = app => {
  // app.post("/signup", async (req, res) => {
  //   const { email } = req.body;
  //   //const pwd = await bcrypt.hash(req.body.password, 5);
  //   // console.log(email);
  //   try {
  //     const result = await User.findOne({ where: { email } });
  //     // console.log(result);
  //     console.log(result !== null);
  //     // if (result !== null) {
  //     // }
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  app.post("/signup", Authentication.signup);

  app.post("/signin", Authentication.login);

  app.get("/api/me", (req, res) => {
    console.log("Auth", req.isAuthenticated());
    // console.log(req.user);

    if (!req.user) {
      return res.status(404).json({ error: "Error" });
    }
    res.json(req.user);
  });

  app.get("/logout", (req, res) => {
    console.log("User ", req.user);
    req.session.destroy();
    req.logout();
    // req.session = null;

    res.redirect("/");
  });
};

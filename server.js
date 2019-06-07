const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const server = express();
const sequelize = require("./database/sequelizeDatabase");

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    server.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

server.use(cors({ origin: "http://localhost:3000", credentials: true }));

server.use(bodyParser.json());

server.use(morgan("combined"));

server.use(
  session({
    secret: "keyboard cat",
    // store: new (require("connect-pg-simple")(session))(),
    store: new SequelizeStore({
      db: sequelize
    }),
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 1000 * 60 * 60 * 24 * 7, // The maximum age (in milliseconds) of a valid session.
    // cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
    resave: false // we support the touch method so per the express-session docs this should be set to false
  })
);

server.use(passport.initialize());
server.use(passport.session());
require("./routes/authRoutes")(server);
require("./routes/userRoutes")(server);
require("./passport/passport");

server.get("/", (req, res) => {
  res.send("<h1>Home</h1>");
});

// server.listen("5000", (req, res) => {
//   console.log("Server started at port 5000");
// });

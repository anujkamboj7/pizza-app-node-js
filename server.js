const express = require("express");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const app = express();
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require("events");
const compression = require("compression");
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

// dotenv
require("dotenv").config();

const db = require("./app/config/db")();

app.use(flash());
app.use(cors());
app.use(compression());
// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Passport config
const passportInit = require("./app/config/passport")(passport);
const facebookInit = require("./app/config/passportAuth/facebook")(passport);
const googleInit = require("./app/config/passportAuth/google")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// view engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

// PORT
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

const io = require("socket.io")(server);

// Socket
io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const os = require("os");

const exphbs = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();


const conn = require("./db/conn");

const Tought = require("./models/Tought");
const User = require("./models/User");

const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

const ToughtController = require("./controllers/toughtController");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    name: "session",
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: path.join(os.tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use(express.static("public"));

app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);
app.get("/", ToughtController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

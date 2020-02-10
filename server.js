// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

//This is "blind" to anything in this file, it only "sees" what is inside its own file.
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));



// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));


// /api/endpoints
/* const apiRouter = express.Router();
apiRoutes(apiRouter, database);
app.use('/api', apiRouter); */
app.get("/main", (req, res) => {
  res.render("main_no_cookies");
});

// /users/endpoints
const usersRoutes = require("./routes/users");
const userRouter  = express.Router();
usersRoutes(userRouter, db);

app.use("/",userRouter);



const widgetsRoutes = require("./routes/widgets");
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
/* app.get("/", (req, res) => {
  res.render("index");
}); */

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

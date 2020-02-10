
const bcrypt = require('bcrypt');
const { getUserWithEmail } = require("../public/scripts/dbFuncs");

/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

//At this moment, all this is doing really is displaying the user data to the page when we go to /api/users. db will be a database object that has the query method as part of it.


module.exports = function(userRouter, database) {
  userRouter.get("/", (req, res) => {
  /*   database.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      }); */

    let userID = req.session.userID;

    if (!userID) {
      res.redirect("/main");
    }
    res.render("index")
});

  //Check if a user exists with a given username and password

  const login = function(email, password) {
    return getUserWithEmail(email, database)
      .then((user) => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  };

  exports.login = login;

  userRouter.post('/login', (req, res) => {
    console.log("inside the post router");
    const {email, password} = req.body;
    console.log("req.body",req.body)
    login(email, password)
      .then((user) => {
        console.log("inside post, looking at user",user)
        if (!user) {
          console.log("There was an error!","user")
          res.send({error: "error"});
          return;
        }
        console.log("This is passed the then error")
        req.session.userID = user.id;
        console.log("I got to the redirect")
        res.redirect("/");
      })
      .catch((err) => {
       console.log("Halp! I'm inside catch!")
        res.send(err)
      });
  });

  userRouter.put("/", (req, res) => {
    console.log("inside the put router for the logout")
    let userID = req.session.userID;

    if (!userID) {
      console.log("Am I in the fail handler?")
      res.redirect("/main");
    }
    res.session = null;
    res.redirect("/main");
  });


  return userRouter;
};


const bcrypt = require('bcrypt');
const { getUserWithEmail, getCategoryFromId, getUserWithID, addUser, checkUsername, getUserResources, getSearchResources, createResource, getFullResource, addComment } = require("../public/scripts/dbFuncs");

/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

//At this moment, all this is doing really is displaying the user data to the page when we go to /api/users. db will be a database object that has the query method as part of it.


module.exports = function(userRouter, database) {
  userRouter.get("/", (req, res) => {

    let userID = req.session.userID;

    if (!userID) {
      return res.redirect("/main");
    }
    res.render("index");
  });

//This handler is used for user requests for their own resources
  userRouter.get("/uresources", (req, res) => {
    let userID = req.session.userID;
    return getUserResources(userID,database)
      .then((userResources) => {
        res.send(userResources);
      });
  });

  //This handler is for search requests.
  userRouter.post("/search", (req, res) => {
    let userID = req.session.userID;
    let searchParam = req.body.searchParam;

    return getSearchResources(userID,database,searchParam)
      .then((searchResults) => {
        res.send(searchResults);
      });
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
    const {email, password} = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userID = user.id;
        res.redirect("/user/");
      })
      .catch((err) => {
        res.send(err);
      });
  });

/*   userRouter.post("/loadresources", (req, res) => {
    let userID = req.session.userID;

    getUserResources(userID, database).then((data) => {
      res.send(data);
    });
  }); */




  userRouter.post("/logout", (req, res) => {
    let userID = req.session.userID;

    if (!userID) {
      res.redirect(303,"/main");
    }
    req.session = null;
    res.redirect(303,"/main");
  });

//I will need to handle whether the username is already taken or not or if that email is already being used

  userRouter.post("/register", (req, res) => {
    const userInfo = req.body;
    console.log(userInfo.username);

    checkUsername(userInfo.username, database)
      .then((exists) => {

        if (exists) {
          res.send("Error, username taken");

        } else {
          userInfo.password = bcrypt.hashSync(userInfo.password, 12);

          addUser(userInfo, database)
            .then((user) => {

              if (!user) {
                res.redirect("/main)");
                return;
              }
              req.session.userId = user.id;
              res.redirect("/user/");
            })
            .catch((err) => res.send(err));
        }
      })
      .catch((err) => err);
  });

  userRouter.post("/newres", async (req, res) => {
    let resourceInfo = req.body;
    resourceInfo.category = await getCategoryFromId(resourceInfo.category, database);
    console.log(resourceInfo);
    let userID = req.session.userID;
    createResource(resourceInfo, database, userID)
      .then(() => {
        res.redirect("/user/");
      })
      .catch((err) => res.send(err.message));
  });

  userRouter.post("/resource", (req, res) => {
    let resID = req.body.ID;
    return getFullResource(resID, database)
      .then((fullResource) => {
        res.send(fullResource);
      })
      .catch((err) => res.send(err.message));
  });

  userRouter.post("/comment", async (req, res) => {
    let commentData = {
      resID: req.body.ID,
      userID: req.session.userID,
      message: req.body.commentSubmission
    };
    let commenterName = await getUserWithID(commentData.userID, database);

    return addComment(commentData, database)
      .then((comment) => {
        comment.comment_author = commenterName.username;
        res.send(comment);
      })
      .catch((err) => res.send(err.message));
  });

  return userRouter;
};

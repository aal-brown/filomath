
const bcrypt = require('bcrypt');
const { getUserWithEmail, getCategoryFromId, getUserWithID, addUser, checkUsername, getUserResources, getSearchResources, createResource, getUserDetails, changeName, getResByCat, getCategories, changeEmail, getFullResource, addComment, toggleLike, getLikedResources } = require("../public/scripts/dbFuncs");

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

//This handler is used for user requests for their liked resources
  userRouter.get("/lresources", (req, res) => {
    let userID = req.session.userID;
    return getLikedResources(userID,database)
      .then((likedResources) => {
        res.send(likedResources);
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

  //This handler is for search requests from the browse categories bar.
  userRouter.post("/search/categs", (req, res) => {
    let userID = req.session.userID;
    let catSearchParam = req.body.catData;

    return getResByCat(userID, database, catSearchParam)
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
    let userID = req.session.userID;

    if (userID) {
      res.session = null;
    }

    const {email, password} = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          res.redirect("/main/");
          return;
        }
        req.session.userID = user.id;
        res.redirect("/user/");
      })
      .catch((err) => {
        res.send(err);
      });
  });


  userRouter.post("/logout", (req, res) => {
    let userID = req.session.userID;

    if (!userID) {
      return res.redirect(303,"/main");
    }
    req.session = null;
    return res.redirect(303,"/main");
  });

  //I will need to handle whether the username is already taken (done) or not or if that email is already being used (not done)
  userRouter.post("/register", (req, res) => {

    let userID = req.session.userID;

    if (userID) {
      res.session = null;
    }
    const userInfo = req.body;

    checkUsername(userInfo.username, database)
      .then((exists) => {

        if (exists) {
          res.send("Error, username taken");
          res.redirect("/main/");
          return;

        } else {
          userInfo.password = bcrypt.hashSync(userInfo.password, 12);

          addUser(userInfo, database)
            .then((user) => {

              if (!user) {
                res.redirect(303,"/main)");
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

  //Get request for the user profile
  userRouter.get("/profile", (req, res) => {
    let userID = req.session.userID;

    if (!userID) {
      return res.redirect(303,"/main");
    } else {
      return getUserDetails(userID, database)
        .then((userData) => {
          res.send(userData);
        });
    }
  });

  //Edit name
  userRouter.post("/profile/editname", (req, res) => {
    let userID = req.session.userID;
    let newName = req.body.name;
    if (!userID) {
      return res.redirect(303,"/main");
    } else {
      changeName(userID, newName, database)
        .then(() => {
          res.sendStatus(200);
        });
    }
  });

  //Edit email
  userRouter.post("/profile/editemail", (req, res) => {
    let userID = req.session.userID;
    let newEmail = req.body.email;
    if (!userID) {
      res.redirect(303,"/main");
    } else {
      changeEmail(userID, newEmail, database)
        .then();
    }
  });

  //Get categories
  userRouter.get("/categories", (req, res) => {
    let userID = req.session.userID;
    if (!userID) {
      res.redirect(303,"/main");
    } else {
      return getCategories(database)
        .then((catData) => {
          res.send(catData);
        });
    }
  });

  userRouter.post("/newres", async (req, res) => {
    let resourceInfo = req.body;

    /* resourceInfo.category = await getCategoryFromId(resourceInfo.category, database); */
    let userID = req.session.userID;
    createResource(resourceInfo, database, userID)
      .then(() => {
        res.redirect("/user/");
      })
      .catch((err) => res.send(err.message));
  });

  userRouter.post("/resource", (req, res) => {
    let resID = req.body.ID;
    let userID = req.session.userID
    return getFullResource(resID, userID, database)
      .then((fullResource) => {
        res.send(fullResource);
      })
      .catch((err) => console.log("resource route err:", err.message));
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

  userRouter.post("/like", (req, res) => {
    let likeData = {
      resID: req.body.ID,
      userID: req.session.userID,
      liked: req.body.liked
    }

    if (likeData.liked === 'true') { likeData.liked = true }
    else { likeData.liked = false };

    // console.log(likeData);

    return toggleLike(likeData, database)
      .then(res => console.log(res)).catch((err) => res.send("LIKE ROUTE ERR:", err.message));
  });

  return userRouter;
};

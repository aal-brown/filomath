/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const userRouter  = express.Router();

//At this moment, all this is doing really is displaying the user data to the page when we go to /api/users. db will be a database object that has the query method as part of it.


module.exports = function(database) {
  userRouter.get("/", (req, res) => {
    database.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return userRouter;
};

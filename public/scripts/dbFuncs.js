
//Function to retrieve a user based on their email
const getUserWithEmail = function(email,db) {
  return db.query(`
  SELECT *
  FROM users
  WHERE email = $1`,[email])
    .then((res) => {
      return res.rows[0];
    });
};

//Function to add a user to the database
const addUser = function(userInfo, db) {
  console.log("Im inside addUser")
  const values = [userInfo.name, userInfo.username, userInfo.email, userInfo.password];
  console.log("values",values);
  return db.query(`
  INSERT INTO users (name, username, email, password)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `,values)
    .then((res) => res.rows[0]);
};

const checkUsername = function(userName, db) {
  return db.query(`
  SELECT username
  FROM users
  WHERE username = $1;
  `,[userName])
    .then((res) => {
      return (res.rows.length > 0 ? true : false);
    });
};

module.exports = {
  getUserWithEmail,
  addUser,
  checkUsername
};



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
  returning *;
  `,values)
    .then((res) => res.rows[0]);
};

const checkUsername = function(userName, db) {
  db.query(`
  SELECT username
  FROM users
  WHERE username = $1
  `,[userName])
    .then(() => {
      console.log("inside the .then function of checkUsername");
      return true})
    .catch(() => {return false});
};

module.exports = {
  getUserWithEmail,
  addUser,
  checkUsername
};


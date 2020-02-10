

const getUserWithEmail = function(email,db) {
  return db.query(`
  SELECT *
  FROM users
  WHERE email = $1`,[email])
    .then((res) => {
      return res.rows[0];
    });
};

const addUser = function(userInfo, db) {
  const values = [userInfo.name, userInfo.username, userInfo.email, userInfo.password];
  return db.query(`
  INSERT INTO users (name, username, email, password)
  VALUES ($1, $2, $3, $4)
  returning *;
  `,values)
    .then((res) => res.rows[0]);
};

module.exports = {
  getUserWithEmail
};


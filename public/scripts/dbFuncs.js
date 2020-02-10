

const getUserWithEmail = function(email,db) {
  return db.query(`
  SELECT *
  FROM users
  WHERE email = $1`,[email])
    .then((res) => {
      return res.rows[0];
    });
};

module.exports = {
  getUserWithEmail
};


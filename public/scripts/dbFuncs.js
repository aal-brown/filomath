
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

//Function to retrive all resources. It will take in 4 parameters, the userId, the database the 'where' parameter and then a sort by parameter.""
const getUserResources = function(userID,db) {
  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.user_id = 1 and ratings.resource_id = resources.id) as user_rating
  FROM resources
  JOIN ratings AS t ON resources.id = t.resource_id
  JOIN likes ON resources.id = likes.resource_id
  WHERE resources.user_id = $1
  GROUP BY resources.id;
  `,[userID])
    .then((res) => {
      resObject = res.rows;
      return db.query(`
      SELECT categories.category
      FROM resources
      JOIN resource_categories ON resources.id = resource_categories.resource_id
      JOIN categories ON resource_categories.category_id = categories.id
      WHERE resources.user_id = $1;
      `,[userID]);
    })
    .then((res) => {
      let i = 0;
      for (let each of resObject) {
        each[Object.keys(res.rows[i])[0]] = Object.values(res.rows[i])[0];
        i++;
      }
      return resObject;
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
  checkUsername,
  getUserResources
};


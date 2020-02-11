
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

//adds a new resource to the database
const createResource = function(resourceInfo, db) {
  const values = [resourceInfo.user_id, resourceInfo.title, resourceInfo.description, resourceInfo.resource_url, resourceInfo.thumbnail_url, resourceInfo.date];
  let resource;
  //insert the new resource
  return db.query(`
  INSERT INTO resources (user_id, title, description, resource_url, thumbnail_url, date)
  VALUES ($1, $2, $3, $4, $5, $6)
  returning *
  `, values)

 .then((res) => {
   resource = res.rows[0]; //grab the resource and make into a new object
   const categoryValues = [resource.id, resourceInfo.categoryID]
   //use resource object to insert new resource category
   return db.query(`
   INSERT INTO resource_categories (resource_id, category_id)
   VALUES ($1, $2)
   `, categoryValues)
  })
  //return resource object with name of category appended
  .then(() => {
    resource.category = resourceInfo.categoryName
    return resource
  })
}

module.exports = {
  getUserWithEmail,
  addUser,
  checkUsername,
  createResource
};


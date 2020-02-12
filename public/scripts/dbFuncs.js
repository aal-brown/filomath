
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

const getUserWithID = function(ID, db) {
  return db.query(`
  SELECT username
  FROM users
  WHERE id = $1
  `, [ID])
    .then((res) => {
      console.log("FINNA RETURN GET USER")
      return res.rows[0];
    });
};

const getCategoryFromId = function(category, db) {
  return db.query(`
  SELECT id FROM categories
  WHERE category = $1
  `,[category])
    .then((res) => {
      return res.rows[0].id
    });
};

//Function to retrive all resources. It will take in 4 parameters, the userId, the database the 'where' parameter and then a sort by parameter.""
const getUserResources = function(userID,db) {
  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.user_id = $1 and ratings.resource_id = resources.id) as user_rating
  FROM resources
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
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
      //Gives us the newest resources first
      resObject.sort((a,b) => {
        return b.date - a.date;
      });
      return resObject;
    });
};



//We will want to display everything like getUserResources, but also username
const getSearchResources = function(userID, db, searchParams) {

  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = $1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE LOWER(resources.title) LIKE '%'||$2||'%'
  OR LOWER(resources.title) LIKE ''||$2||'%'
  OR LOWER(resources.title) LIKE '%'||$2||''
  OR LOWER(resources.title) LIKE ''||$2||''
  OR LOWER(users.username) LIKE ''||$2||'%'
  OR LOWER(users.username) LIKE '%'||$2||''
  OR LOWER(users.username) LIKE ''||$2||''
  GROUP BY resources.id, users.id, categories.category;
  `,[userID,searchParams])
    .then((res) => {
      resObject = res.rows;

      resObject.sort((a,b) => {
        return b.date - a.date;
      });
      return resObject;
    });
};


//Function to add a user to the database
const addUser = function(userInfo, db) {
  const values = [userInfo.name, userInfo.username, userInfo.email, userInfo.password];

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
const createResource = function(resourceInfo, db, userID) {
  let date = new Date().toISOString();
  let categoryID = resourceInfo.category;
  const values = [userID, resourceInfo.title, resourceInfo.description, resourceInfo.url, resourceInfo.thumbnail_url, date];
  let resource;
  //insert the new resource
  return db.query(`
  INSERT INTO resources (user_id, title, description, resource_url, thumbnail_url, date)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `, values)
  .then((res) => {
    resource = res.rows[0]; //grab the resource and make into a new object
    const categoryValues = [resource.id, categoryID];
    //use resource object to insert new resource category
    return db.query(`
    INSERT INTO resource_categories (resource_id, category_id)
    VALUES ($1, $2)
    `, categoryValues);
  })
  .then(() => {
    const ratingValues = [resource.id, userID, resourceInfo.rating];
    //use resource object to insert rating
    return db.query(`
    INSERT INTO ratings (resource_id, user_id, rating)
    VALUES ($1, $2, $3)
    `, ratingValues)
  });
  //return resource object with name of category appended
  // .then(() => {
  //   resource.category = resourceInfo.categoryName;
  //   return resource;
  // });
};

const getFullResource = function(resID, db) {
  let resObj;
  //query database for all resource data except for comments
  return db.query(`
  SELECT resources.id, resources.user_id, users.username as author, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = resources.user_id group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE resources.id = $1
  GROUP BY resources.id, users.id, categories.category
  `, [resID])
  .then((res) => {
    resObj = res.rows[0]; //create object with resource data
    //query database for comment data
    return db.query(`
    SELECT comments.resource_id, comments.user_id, users.username as comment_author, comments.message, comments.date
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.resource_id = $1
    ORDER BY comments.date DESC;
    `, [resID])
  })
  .then((res) => {
    //append comment data to resource object and return object
    resObj.commentData = res.rows;
    return resObj;
  })
};

const addComment = function(commentData, db) {
  let date = new Date().toISOString();
  let values = [commentData.resID, commentData.userID, commentData.message, date];
  return db.query(`
  INSERT INTO comments (resource_id, user_id, message, date)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, values)
  .then((res) => {
    return res.rows[0];
  })
};

module.exports = {
  getUserWithEmail,
  getCategoryFromId,
  getUserWithID,
  addUser,
  checkUsername,
  getUserResources,
  createResource,
  getSearchResources,
  getFullResource,
  addComment
};


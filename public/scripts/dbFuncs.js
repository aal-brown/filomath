
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

//checks if a user has liked a specific resource, returns true if they have
const isLiked = function(resID, userID, db) {
  return db.query(`
  SELECT * FROM likes
  WHERE resource_id = $1 AND user_id = $2
  `,[resID, userID])
    .then((res) => {
      let result = res.rows;
      if(result.length === 0) {return false};
      return true;
    })
}

//Function to retrive all resources. It will take in 4 parameters, the userId, the database the 'where' parameter and then a sort by parameter.""
const getUserResources = function(userID,db) {
  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = $1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE resources.user_id = $1
  GROUP BY resources.id, users.id, categories.category;
  `,[userID])
    .then((res) => {
      resObject = res.rows;
      resObject.sort((a,b) => {
        return b.date - a.date;
      });
    })
    .then( async () => {
      for (let row of resObject) {
        row.liked = await isLiked(row.id, userID, db);
      }
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
    })
      .then( async () => {
        for (let row of resObject) {
          row.liked = await isLiked(row.id, userID, db);
        }
        return resObject;
      });
};

const getResByCat = function(userID, db, categoryID) {
  console.log("getResByCat")
  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = $1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE categories.id = $2
  GROUP BY resources.id, users.id, categories.category;
  `,[userID,categoryID])
    .then((res) => {
      resObject = res.rows;
      resObject.sort((a,b) => {
        return b.date - a.date;
      });
    })
    .then( async () => {
      for (let row of resObject) {
        row.liked = await isLiked(row.id, userID, db);
      }
      return resObject;
    });
};

const getUserDetails = function(userID, db) {

  return db.query(`
  SELECT users.id, users.name, users.email, users.password, (SELECT count(resources.user_id) as created_resources FROM resources WHERE user_id = $1), (SELECT count(likes.id) AS my_likes FROM likes WHERE user_id = $1), (SELECT count(comments.id) AS my_comments FROM comments WHERE user_id = $1), (SELECT count(ratings.id) AS my_ratings FROM ratings WHERE user_id = $1)
  FROM users
  JOIN resources ON users.id = resources.user_id
  JOIN likes ON users.id = likes.user_id
  JOIN comments on users.id = comments.user_id
  JOIN ratings on users.id = ratings.user_id
  WHERE users.id = $1
  GROUP BY users.id;
  `,[userID])
    .then((res) => {
      return res.rows[0];
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


const changeName = function(userID, newName, db) {

  return db.query(`
  UPDATE users
  SET name = $2
  WHERE users.id = $1;
  `,[userID,newName])
    .then();

};

const changeEmail = function(userID, newEmail, db) {
  console.log(newEmail)
  return db.query(`
  UPDATE users
  SET email = $2
  WHERE users.id = $1;
  `,[userID,newEmail])
    .then();

};


const getCategories = function(db) {

  return db.query(`
  SELECT DISTINCT id, category
  FROM categories
  ORDER BY category;
  `)
    .then((res) => {
      return res.rows;
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
      `, ratingValues);
    });
};

const getFullResource = function(resID, userID, db) {
  let resObj;
  //query database for all resource data except for comments
  return db.query(`
  SELECT resources.id, resources.user_id, users.username as author, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = $2 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE resources.id = $1
  GROUP BY resources.id, users.id, categories.category
  `, [resID, userID])
    .then((res) => {
      resObj = res.rows[0]; //create object with resource data
      //query database for comment data
      return db.query(`
      SELECT comments.resource_id, comments.user_id, users.username as comment_author, comments.message, comments.date
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.resource_id = $1
      ORDER BY comments.date DESC;
      `, [resID]);
    })
    .then((res) => {
      //append comment data to resource object
      resObj.commentData = res.rows;
    })
      .then( async () => {
        resObj.liked = await isLiked(resObj.id, userID, db);
        return resObj;
      });
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
    });
};

const toggleLike = function(likeData, db) {
  if (likeData.liked) {
    return db.query(`
    DELETE FROM likes
    WHERE resource_id = $1 AND user_id = $2
    RETURNING *;
    `, [likeData.resID, likeData.userID])
      .then((res) => {
      // console.log("DELETE LIKE: ", res.rows);
      return res.rows;
    });
  } else {
    return db.query(`
    INSERT INTO likes (resource_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
    `, [likeData.resID, likeData.userID])
    .then((res) => {
      // console.log("ADD LIKE: ", res.rows)
      return res.rows;
    });
  };
};

const rate = function(rateData, db) {
  let values = [rateData.newRating, rateData.resID, rateData.userID];
  if (rateData.oldRating === 'null') {
    return db.query(`
    INSERT INTO ratings (resource_id, user_id, rating)
    VALUES ($2, $3, $1)
    RETURNING *;
    `, values)
    .then((res) => {
      return res.rows[0];
    });
  } else {
    return db.query(`
    UPDATE ratings
    SET rating = $1
    WHERE resource_id = $2 AND user_id = $3
    RETURNING *;
    `, values)
      .then((res) => {
      return res.rows[0];
    });
  };
};

const getLikedResources = function(userID,db) {
  let resObject;
  return db.query(`
  SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = $1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE likes.user_id = $1 AND resources.user_id != $1
  GROUP BY resources.id, users.id, categories.category;
  `,[userID])
    .then((res) => {
      resObject = res.rows;
      resObject.sort((a,b) => {
        return b.date - a.date;
      });
    })
    .then( async () => {
      for (let row of resObject) {
        row.liked = await isLiked(row.id, userID, db);
      }
      return resObject;
    });
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
  getUserDetails,
  changeName,
  getResByCat,
  getCategories,
  changeEmail,
  getFullResource,
  addComment,
  isLiked,
  toggleLike,
  getLikedResources,
  rate
};

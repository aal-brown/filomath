
/* Show users name and the title of all resources that they have liked */
/* SELECT users.name, resources.title
FROM users
JOIN likes ON users.id = likes.user_id
JOIN resources ON likes.resource_id = resources.id
ORDER BY users.name; */

/* Show resource title and number of likes */
/* SELECT resources.title, COUNT(likes.*) AS total_likes
FROM resources
JOIN likes ON resources.id = likes.resource_id
GROUP BY resources.title
ORDER BY total_likes DESC; */

/* Show resource title and average rating */
/* SELECT resources.title, AVG(ratings.rating) AS average_rating
FROM resources
JOIN ratings ON resources.id = ratings.resource_id
GROUP BY resources.title
ORDER BY average_rating DESC; */

/* Show all comments for resource 5*/
/* SELECT resources.title, comments.message
FROM resources
JOIN comments ON resources.id = comments.resource_id
WHERE resources.id = 5
ORDER BY resources.title; */

/* Show all resources by title with the category*/
/* SELECT resources.title, categories.category
FROM resources
JOIN resource_categories ON resources.id = resource_categories.resource_id
JOIN categories on resource_categories.category_id = categories.id
ORDER BY resources.title; */

/* Select resource userID, title, resURL, thumbURL, date, number of likes, avg rating, self rating */

/* SELECT resources.id, resources.user_id, resources.title, resources.resource_url, resources.thumbnail_url, resources.date, count(likes.resource_id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.user_id = 1 and ratings.resource_id = resources.id) as user_rating
FROM resources
JOIN ratings AS t ON resources.id = t.resource_id
JOIN likes ON resources.id = likes.resource_id
WHERE resources.user_id = 1
GROUP BY resources.id; */

/* get rating and avg rating, by userID for all users resources */

/* SELECT resources.id, avg(t.rating) as avg_rating, (SELECT ratings.rating from ratings where ratings.user_id = 2 and ratings.resource_id = resources.id) as rating
FROM resources
JOIN ratings as t on resources.id = t.resource_ID
WHERE resources.user_id = 2
GROUP BY resources.id; */

/* Get category for all user resources */

/* SELECT resources.id, categories.category
FROM resources
JOIN resource_categories ON resources.id = resource_categories.resource_id
JOIN categories ON resource_categories.category_id = categories.id
WHERE resources.user_id = 1; */

/* This is to test out the search function */
/* SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = 1) as user_rating
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  WHERE LOWER(resources.title) LIKE '%"$1"' OR resources.title LIKE 'the%' OR resources.title LIKE '%'||$1||'' OR resources.title LIKE 'the'
  GROUP BY resources.id, users.id; */


/* Doing some simpler tests */
/* SELECT resources.id, resources.user_id, (SELECT users.username from resources where resources.user_id = users.id) as username
  FROM resources
  JOIN users ON resources.user_id = users.id
  WHERE resources.title LIKE '%wiki%' OR resources.title LIKE 'wiki%' OR resources.title LIKE '%wiki' OR resources.title LIKE 'wiki'
  GROUP BY resources.id, users.id;
 */

/* More testing */
/*  SELECT resources.title, users.username
 FROM resources
 JOIN users ON resources.user_id = users.id;
 group by resources.id, users.id; */


/* SELECT resources.title, users.username
  FROM resources
  JOIN users ON resources.user_id = users.id
  WHERE resources.title LIKE '%wiki%' OR resources.title LIKE 'wiki%' OR resources.title LIKE '%wiki' OR resources.title LIKE 'wiki'
  GROUP BY resources.id, users.id; */

/* Attempting to also include the category for each resource, in one query - SUCCESS!*/
/* SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = 1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE LOWER(resources.title) LIKE '%wiki%' OR resources.title LIKE 'wiki%' OR resources.title LIKE '%wiki' OR resources.title LIKE 'wiki'
  GROUP BY resources.id, users.id, categories.category; */

  /* Fetch all relevant user information'
  username, user_id (not displayed), number of liked resources, number of comments, number of created resources (so find the user_id associated with a resource), number of ratings, email address,
   */
/* SELECT users.id, users.name, users.email, users.password, (SELECT count(resources.user_id) as created_resources FROM resources WHERE user_id = 4), (SELECT count(likes.id) AS my_likes FROM likes WHERE user_id = 4), (SELECT count(comments.id) AS my_comments FROM comments WHERE user_id = 4), (SELECT count(ratings.id) AS my_ratings FROM ratings WHERE user_id = 4)
FROM users
JOIN resources ON users.id = resources.user_id
JOIN likes ON users.id = likes.user_id
JOIN comments on users.id = comments.user_id
JOIN ratings on users.id = ratings.user_id
WHERE users.id = 4
GROUP BY users.id; */

/* Number of likes per user */
/* SELECT users.id, users.name, count(likes.id)
FROM users
JOIN likes ON users.id = likes.user_id
GROUP BY users.id
order by users.id; */

/* Number of comments per user */
/* SELECT users.id, users.name, count(comments.id)
FROM users
JOIN comments ON users.id = comments.user_id
GROUP BY users.id
order by users.id; */


/* Number of ratings per user */
/* SELECT users.id, users.name, count(ratings.id)
FROM users
JOIN ratings ON users.id = ratings.user_id
GROUP BY users.id
order by users.id; */

/* Update username in table */
/* UPDATE users
SET name = 'Tristan Jacobs'
WHERE users.id = 1; */

/* Searching for everything that has a specified category id */
/* SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = 1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE categories.id = 1
  GROUP BY resources.id, users.id, categories.category; */


/* Fetch liked resources, excluding resources where the user ID matches the current user.*/
/* SELECT resources.id, resources.user_id, users.username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = 1 group by resources.id, ratings.rating) as user_rating, categories.category
  FROM resources
  JOIN users ON resources.user_id = users.id
  LEFT JOIN ratings AS t ON resources.id = t.resource_id
  LEFT JOIN likes ON resources.id = likes.resource_id
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  WHERE likes.user_id = 1 AND resources.user_id != 1
  GROUP BY resources.id, users.id, categories.category; */


/* TEstni */
SELECT users.id, users.name, users.email, users.password, (SELECT count(resources.user_id) as created_resources FROM resources WHERE user_id = 31), (SELECT count(likes.id) AS my_likes FROM likes WHERE user_id = 31), (SELECT count(comments.id) AS my_comments FROM comments WHERE user_id = 31), (SELECT count(ratings.id) AS my_ratings FROM ratings WHERE user_id = 31)
  FROM users
  LEFT JOIN resources ON users.id = resources.user_id
  LEFT JOIN likes ON users.id = likes.user_id
  LEFT JOIN comments on users.id = comments.user_id
  LEFT JOIN ratings on users.id = ratings.user_id
  WHERE users.id = 31
  GROUP BY users.id;

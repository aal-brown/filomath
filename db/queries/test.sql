
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
SELECT resources.id, resources.user_id, (SELECT users.username from users where users.id = resources.user_id group by resources.id) as username, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id) as user_rating
  FROM resources
  JOIN users ON resources.user_id = users.id
  JOIN ratings AS t ON resources.id = t.resource_id
  JOIN likes ON resources.id = likes.resource_id
  WHERE resources.title LIKE '%wiki%' OR resources.title LIKE 'wiki%' OR resources.title LIKE '%wiki' OR resources.title LIKE 'wiki'
  GROUP BY resources.id;

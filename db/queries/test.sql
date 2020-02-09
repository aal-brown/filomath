
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
SELECT resources.title, categories.category
FROM resources
JOIN resource_categories ON resources.id = resource_categories.resource_id
JOIN categories on resource_categories.category_id = categories.id
ORDER BY resources.title;

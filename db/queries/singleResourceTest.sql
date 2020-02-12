-- testing query for single resource page
-- SELECT resources.id, resources.user_id, users.username as author, resources.title, resources.description, resources.resource_url, resources.thumbnail_url, resources.date, (SELECT count(likes.*) from likes WHERE likes.resource_id = resources.id) as likes, avg(t.rating) as global_rating, (SELECT ratings.rating from ratings where ratings.resource_id = resources.id and ratings.user_id = resources.user_id group by resources.id, ratings.rating) as user_rating, categories.category
-- FROM resources
-- JOIN users ON resources.user_id = users.id
-- LEFT JOIN ratings AS t ON resources.id = t.resource_id
-- LEFT JOIN likes ON resources.id = likes.resource_id
-- LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
-- LEFT JOIN categories ON resource_categories.category_id = categories.id
-- WHERE resources.id = 1
-- GROUP BY resources.id, users.id, categories.category

-- testing query for comments of a single resource
SELECT comments.resource_id, comments.user_id, users.username as comment_author, comments.message, comments.date
FROM comments
JOIN users ON comments.user_id = users.id
WHERE comments.resource_id = 1
ORDER BY comments.date;
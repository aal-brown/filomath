
DROP TABLE IF EXISTS resources CASCADE;
CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,

  date TIMESTAMP
);
